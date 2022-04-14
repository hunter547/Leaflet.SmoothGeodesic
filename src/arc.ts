// ///////////
// PURPOSE ///
// ///////////
/* 
  This file takes in two points, a start and end point, then calculates
  and returns an array of coordinates that lie on a great circle (geodesic)
  path. We can use those points to draw a curve on our leaflet map to show
  the user the shortest path from start to end. There are two implementations
  in this file, both are meant to do the same thing - take in two coordinates
  and a number that signifies how many coordinates should be generated along
  the curve.
*/

// ///////////////////////
// FIRST IMPLEMENTATION //
// ///////////////////////

// SOURCE
// Adaptation of springmeyer's arc.js
// https://github.com/springmeyer/arc.js
const D2R = Math.PI / 180
const R2D = 180 / Math.PI

// TYPES
type Properties = any
type Coordinates = [number, number]
type Options = { offset?: number }

// CLASSES
class Coord {
  lon: number
  lat: number
  x: number
  y: number
  constructor(lat: number, lon: number) {
    this.lat = lat
    this.lon = lon
    this.x = D2R * lon
    this.y = D2R * lat
  }
  view() {
    return String(this.lon).slice(0, 4) + "," + String(this.lat).slice(0, 4)
  }
  antipode() {
    const antiLat = -1 * this.lat
    const antiLon = this.lon < 0 ? 180 + this.lon : (180 - this.lon) * -1
    return new Coord(antiLon, antiLat)
  }
}

class LineString {
  coords: Coordinates[]
  length: number
  constructor() {
    this.coords = []
    this.length = 0
  }
  moveTo(coord: Coordinates) {
    this.length++
    this.coords.push(coord)
  }
}

class Arc {
  properties: Properties
  geometries: LineString[]
  constructor(properties: any) {
    this.properties = properties || {}
    this.geometries = []
  }
}

// http://en.wikipedia.org/wiki/Great-circle_distance
class GreatCircle {
  start: Coord
  end: Coord
  properties: Properties
  g: number
  constructor(start: Coordinates, end: Coordinates, properties?: Properties) {
    if (!start || start[0] === undefined || start[1] === undefined) {
      throw new Error(
        "GreatCircle constructor expects two args: start and end objects with x and y properties"
      )
    }
    if (!end || end[0] === undefined || end[1] === undefined) {
      throw new Error(
        "GreatCircle constructor expects two args: start and end objects with x and y properties"
      )
    }
    this.start = new Coord(start[0], start[1])
    this.end = new Coord(end[0], end[1])
    this.properties = properties || {}

    const w = this.start.x - this.end.x
    const h = this.start.y - this.end.y
    const z =
      Math.pow(Math.sin(h / 2.0), 2) +
      Math.cos(this.start.y) *
        Math.cos(this.end.y) *
        Math.pow(Math.sin(w / 2.0), 2)
    this.g = 2.0 * Math.asin(Math.sqrt(z))

    if (this.g === Math.PI) {
      throw new Error(
        "it appears " +
          this.start.view() +
          " and " +
          this.end.view() +
          " are 'antipodal', e.g diametrically opposite, thus there is no single route but rather infinite"
      )
    } else if (isNaN(this.g)) {
      throw new Error(
        "could not calculate great circle between " + start + " and " + end
      )
    }
  }
  // http://williams.best.vwh.net/avform.htm#Intermediate
  interpolate(f: number) {
    const A = Math.sin((1 - f) * this.g) / Math.sin(this.g)
    const B = Math.sin(f * this.g) / Math.sin(this.g)
    const x =
      A * Math.cos(this.start.y) * Math.cos(this.start.x) +
      B * Math.cos(this.end.y) * Math.cos(this.end.x)
    const y =
      A * Math.cos(this.start.y) * Math.sin(this.start.x) +
      B * Math.cos(this.end.y) * Math.sin(this.end.x)
    const z = A * Math.sin(this.start.y) + B * Math.sin(this.end.y)
    const lat = R2D * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))
    const lon = R2D * Math.atan2(y, x)
    return [lat, lon]
  }
  // Generate points along the great circle
  Arc(exponentialMidpoints: number, options?: Options) {
    const npoints = 1 + 2 ** (exponentialMidpoints + 1)
    const firstPass = []
    if (!npoints || npoints <= 2) {
      firstPass.push([this.start.lat, this.start.lon])
      firstPass.push([this.end.lat, this.end.lon])
    } else {
      const delta = 1.0 / (npoints - 1)
      for (let i = 0; i < npoints; ++i) {
        const step = delta * i
        const pair = this.interpolate(step)
        firstPass.push(pair)
      }
    }
    /* partial port of dateline handling from:
      gdal/ogr/ogrgeometryfactory.cpp

      TODO - does not handle all wrapping scenarios yet
    */
    let bHasBigDiff = false
    let dfMaxSmallDiffLong = 0
    // from http://www.gdal.org/ogr2ogr.html
    // -datelineoffset:
    // (starting with GDAL 1.10) offset from dateline in degrees (default long. = +/- 10deg, geometries within 170deg to -170deg will be splited)
    const dfDateLineOffset = options && options.offset ? options.offset : 10
    const dfLeftBorderX = 180 - dfDateLineOffset
    const dfRightBorderX = -180 + dfDateLineOffset
    const dfDiffSpace = 360 - dfDateLineOffset

    // https://github.com/OSGeo/gdal/blob/7bfb9c452a59aac958bff0c8386b891edf8154ca/gdal/ogr/ogrgeometryfactory.cpp#L2342
    for (let j = 1; j < firstPass.length; ++j) {
      const dfPrevX = firstPass[j - 1][1]
      const dfX = firstPass[j][1]
      const dfDiffLong = Math.abs(dfX - dfPrevX)
      if (
        dfDiffLong > dfDiffSpace &&
        ((dfX > dfLeftBorderX && dfPrevX < dfRightBorderX) ||
          (dfPrevX > dfLeftBorderX && dfX < dfRightBorderX))
      ) {
        bHasBigDiff = true
      } else if (dfDiffLong > dfMaxSmallDiffLong) {
        dfMaxSmallDiffLong = dfDiffLong
      }
    }

    const poMulti = []
    if (bHasBigDiff && dfMaxSmallDiffLong < dfDateLineOffset) {
      let poNewLS: [number, number][] = []
      poMulti.push(poNewLS)
      for (let k = 0; k < firstPass.length; ++k) {
        const dfX0 = firstPass[k][1]
        if (k > 0 && Math.abs(dfX0 - firstPass[k - 1][1]) > dfDiffSpace) {
          let dfX1 = firstPass[k - 1][1]
          let dfY1 = firstPass[k - 1][0]
          let dfX2 = firstPass[k][1]
          let dfY2 = firstPass[k][0]
          if (
            dfX1 > -180 &&
            dfX1 < dfRightBorderX &&
            dfX2 === 180 &&
            k + 1 < firstPass.length &&
            firstPass[k - 1][1] > -180 &&
            firstPass[k - 1][1] < dfRightBorderX
          ) {
            poNewLS.push([firstPass[k][0], -180])
            k++
            poNewLS.push([firstPass[k][0], firstPass[k][1]])
            continue
          } else if (
            dfX1 > dfLeftBorderX &&
            dfX1 < 180 &&
            dfX2 === -180 &&
            k + 1 < firstPass.length &&
            firstPass[k - 1][1] > dfLeftBorderX &&
            firstPass[k - 1][1] < 180
          ) {
            poNewLS.push([firstPass[k][0], 180])
            k++
            poNewLS.push([firstPass[k][0], firstPass[k][1]])
            continue
          }

          if (dfX1 < dfRightBorderX && dfX2 > dfLeftBorderX) {
            // swap dfX1, dfX2
            const tmpX = dfX1
            dfX1 = dfX2
            dfX2 = tmpX
            // swap dfY1, dfY2
            const tmpY = dfY1
            dfY1 = dfY2
            dfY2 = tmpY
          }
          if (dfX1 > dfLeftBorderX && dfX2 < dfRightBorderX) {
            dfX2 += 360
          }

          if (dfX1 <= 180 && dfX2 >= 180 && dfX1 < dfX2) {
            const dfRatio = (180 - dfX1) / (dfX2 - dfX1)
            const dfY = dfRatio * dfY2 + (1 - dfRatio) * dfY1
            poNewLS.push([
              dfY,
              firstPass[k - 1][1] > dfLeftBorderX ? 180 : -180
            ])
            poNewLS = []
            poNewLS.push([
              dfY,
              firstPass[k - 1][1] > dfLeftBorderX ? -180 : 180
            ])
            poMulti.push(poNewLS)
          } else {
            poNewLS = []
            poMulti.push(poNewLS)
          }
          poNewLS.push([firstPass[k][0], dfX0])
        } else {
          poNewLS.push([firstPass[k][0], firstPass[k][1]])
        }
      }
    } else {
      // add normally
      const poNewLS0: [number, number][] = []
      poMulti.push(poNewLS0)
      for (let l = 0; l < firstPass.length; ++l) {
        poNewLS0.push([firstPass[l][0], firstPass[l][1]])
      }
    }

    const arc = new Arc(this.properties)
    for (let m = 0; m < poMulti.length; ++m) {
      const line = new LineString()
      arc.geometries.push(line)
      const points = poMulti[m]
      for (let j0 = 0; j0 < points.length; ++j0) {
        line.moveTo(points[j0])
      }
    }
    return arc
  }
}

// ////////////////////////
// SECOND IMPLEMENTATION //
// ////////////////////////
// (less code, but maybe less accurate? Points seem to line up, so maybe just as good)

// Used to get the midpoint using a geodesic formula
// SOURCE
// Adaptation of Henry Thasler's (and company) Leaflet.Geodesic 
// https://github.com/henrythasler/Leaflet.Geodesic/blob/master/src/geodesic-core.ts
// function midpoint(start: LatLng, dest: LatLng): [number, number] {
//   // om = atan2( sinφ1 + sinφ2, √( (cosφ1 + cosφ2⋅cosΔλ)² + cos²φ2⋅sin²Δλ ) )
//   // ym = λ1 + atan2(cosφ2⋅sinΔλ, cosφ1 + cosφ2⋅cosΔλ)
//   // midpoint is sum of vectors to two points: mathforum.org/library/drmath/view/51822.html

//   function toRadians(degree: number): number {
//     return (degree * Math.PI) / 180
//   }

//   function toDegrees(radians: number): number {
//     return (radians * 180) / Math.PI
//   }

//   const φ1 = toRadians(start.lat)
//   const λ1 = toRadians(start.lng)
//   const φ2 = toRadians(dest.lat)
//   const Δλ = toRadians(dest.lng - start.lng)

//   // get cartesian coordinates for the two points
//   const A = { x: Math.cos(φ1), y: 0, z: Math.sin(φ1) } // place point A on prime meridian y=0
//   const B = {
//     x: Math.cos(φ2) * Math.cos(Δλ),
//     y: Math.cos(φ2) * Math.sin(Δλ),
//     z: Math.sin(φ2)
//   }

//   // vector to midpoint is sum of vectors to two points (no need to normalise)
//   const C = { x: A.x + B.x, y: A.y + B.y, z: A.z + B.z }

//   // φm
//   const om = Math.atan2(C.z, Math.sqrt(C.x * C.x + C.y * C.y))
//   // λm
//   const ym = λ1 + Math.atan2(C.y, C.x)

//   return [toDegrees(om), toDegrees(ym)]
// }

// function recursiveMidpoint(
//   start: [number, number],
//   dest: [number, number],
//   iterations: number
// ): [number, number][] {
//   const midpointArray: [number, number][] = [start, dest]
//   const nextMidpoint = midpoint(
//     new LatLng(start[0], start[1]),
//     new LatLng(dest[0], dest[1])
//   )

//   if (iterations > 0) {
//     midpointArray.splice(
//       0,
//       1,
//       ...recursiveMidpoint(start, nextMidpoint, iterations - 1)
//     )
//     midpointArray.splice(
//       midpointArray.length - 2,
//       2,
//       ...recursiveMidpoint(nextMidpoint, dest, iterations - 1)
//     )
//   } else {
//     midpointArray.splice(1, 0, nextMidpoint)
//   }

//   return midpointArray
// }

export { GreatCircle }
