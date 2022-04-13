import L, { LatLngExpression, SmoothGeodesicOptions } from 'leaflet'
import { greatCircleCoordinates } from './types-resolver'
import { GreatCircle } from "./arc"
import { Coordinates, SmoothGeodesicLatLngControlPoints, SmoothGeodesicPathData, SmoothGeodesicPathDataElement, SmoothGeodesicSVGCommand } from "../typings/smoothgeodesic"

L.SmoothGeodesic = L.Path.extend({
  options: {},

  initialize: function (origin: L.LatLng | [number, number], destination: L.LatLng | [number, number], exponentialMidpointCalculations:number, options?: SmoothGeodesicOptions) {
    L.setOptions(this, options)
    this._coords = [] as Coordinates[]
    this._generateCoordinates(origin, destination, exponentialMidpointCalculations)
    this._setPath(this._catmullRom2bezier())
  },

  _generateCoordinates: function(origin: L.LatLng | [number, number], destination: L.LatLng | [number, number], exponentialMidpointCalculations:number): void {
    const generator = new GreatCircle(greatCircleCoordinates(origin), greatCircleCoordinates(destination))
    const { geometries } = generator.Arc(exponentialMidpointCalculations)
    this._coords = geometries[0].coords
  },

  _catmullRom2bezier: function(
  ): SmoothGeodesicPathData {
    const catmullPathArray: SmoothGeodesicPathData = ["M", this._coords[0]]
    const crp: number[] = this._coords.flat() as number[]
  
    for (let i = 0, iLen = crp.length; iLen - 2 > i; i += 2) {
      const p: Array<{ x: number; y: number }> = []
      if (0 === i) {
        p.push({ x: crp[i], y: crp[i + 1] })
        p.push({ x: crp[i], y: crp[i + 1] })
        p.push({ x: crp[i + 2], y: crp[i + 3] })
        p.push({ x: crp[i + 4], y: crp[i + 5] })
      } else if (iLen - 4 === i) {
        p.push({ x: crp[i - 2], y: crp[i - 1] })
        p.push({ x: crp[i], y: crp[i + 1] })
        p.push({ x: crp[i + 2], y: crp[i + 3] })
        p.push({ x: crp[i + 2], y: crp[i + 3] })
      } else {
        p.push({ x: crp[i - 2], y: crp[i - 1] })
        p.push({ x: crp[i], y: crp[i + 1] })
        p.push({ x: crp[i + 2], y: crp[i + 3] })
        p.push({ x: crp[i + 4], y: crp[i + 5] })
      }
  
      // Catmull-Rom to Cubic Bezier conversion matrix
      //    0       1       0       0
      //  -1/6      1      1/6      0
      //    0      1/6      1     -1/6
      //    0       0       1       0
  
      const bp = []
      bp.push({ x: p[1].x, y: p[1].y })
      bp.push({
        x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
        y: (-p[0].y + 6 * p[1].y + p[2].y) / 6
      })
      bp.push({
        x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
        y: (p[1].y + 6 * p[2].y - p[3].y) / 6
      })
      bp.push({ x: p[2].x, y: p[2].y })
  
      catmullPathArray.push(
        "C",
        [bp[1].x, bp[1].y],
        [bp[2].x, bp[2].y],
        [bp[3].x, bp[3].y]
      )
    }
  
    return catmullPathArray
  },

  // Added to follow the naming convention of L.Polyline and other Leaflet component classes:
  // (https://leafletjs.com/reference-1.6.0.html#polyline-setlatlngs)
  setLatLngs: function (path: any) {
    return this.setPath(path)
  },

  getLatLngs: function () {
    return this.getPath()
  },

  getPath: function () {
    return this._pathData
  },

  setPath: function (path: SmoothGeodesicPathData) {
    this._setPath(path)
    return this.redraw()
  },

  getBounds: function () {
    return this._bounds
  },

  _setPath: function (path: SmoothGeodesicPathData) {
    this._pathData = path
    this._bounds = this._computeBounds()
  },

  _SmoothGeodesicSVGCommand: function (command: string): command is SmoothGeodesicSVGCommand {
    return ["M", "L", "H", "V", "C", "S", "Q", "T", "Z"].indexOf(command) !== -1
  },

  _computeBounds: function () {
    const bound = L.latLngBounds([])
    let lastPoint: SmoothGeodesicLatLngControlPoints = L.latLng(0, 0)
    let lastCommand: SmoothGeodesicSVGCommand = "M"
    let coord: SmoothGeodesicPathDataElement
    for (let i = 0; i < this._pathData.length; i++) {
      coord = this._pathData[i]
      if (this._isSmoothGeodesicSVGCommand(coord)) {
        lastCommand = coord as SmoothGeodesicSVGCommand
      } else if (lastCommand === "C") {
        const controlPoint1 = L.latLng(coord[0] as number, coord[1] as number)
        coord = this._pathData[++i]
        const controlPoint2 = L.latLng(coord[0] as number, coord[1] as number)
        coord = this._pathData[++i]
        const endPoint: SmoothGeodesicLatLngControlPoints = L.latLng(
          coord[0] as number,
          coord[1] as number
        )

        bound.extend(controlPoint1)
        bound.extend(controlPoint2)
        bound.extend(endPoint)

        endPoint.controlPoint1 = controlPoint1
        endPoint.controlPoint2 = controlPoint2
        lastPoint = endPoint
      } else {
        bound.extend(coord as LatLngExpression)
        lastPoint = L.latLng(coord[0] as number, coord[1] as number)
      }
    }
    return bound
  },

  getCenter: function () {
    return this._bounds.getCenter()
  },

  // _update() is invoked by Path._reset()
  _update: function () {
    if (!this._map) {
      return
    }

    // TODO: consider implementing this._clipPoints(); and this._simplifyPoints(); to improve performance
    // the following can be thought of as this._renderer.updateCurve() in both SVG/Canvas renderers
    // similar to Canvas._updatePoly(), Canvas._updateCircle(), etc...
    this._updateCurveSvg()
  },

  // _project() is invoked by Path._reset()
  _project: function () {
    let coord: string | [number, number],
      lastCoord: [number, number] = [0, 0],
      curCommand: SmoothGeodesicSVGCommand = "M",
      curPoint: L.Point = L.point(0, 0)
    const map: L.Map = this._map

    this._points = []

    for (let i = 0; i < this._pathData.length; i++) {
      coord = this._pathData[i]
      if (this._isCurveSVGCommand(coord)) {
        this._points.push(coord)
        curCommand = coord as SmoothGeodesicSVGCommand
      } else {
        switch (coord.length) {
          case 2:
            const projectedPoint = map.project(
              L.latLng(coord[0] as number, coord[1] as number)
            )
            curPoint = projectedPoint.subtract(map.getPixelOrigin())
            lastCoord = coord as [number, number]
            break
          case 1:
            if (curCommand === "H") {
              const projectedPoint = map.project(
                L.latLng(lastCoord[0] as number, coord[0] as unknown as number)
              )
              curPoint = projectedPoint.subtract(map.getPixelOrigin())
              lastCoord = [lastCoord[0], coord[0] as unknown as number]
            } else {
              const projectedPoint = map.project(
                L.latLng(coord[0] as unknown as number, lastCoord[1] as number)
              )
              curPoint = projectedPoint.subtract(map.getPixelOrigin())
              lastCoord = [coord[0] as unknown as number, lastCoord[1]]
            }
            break
        }
        this._points.push(curPoint)
      }
    }
  },

  _curvePointsToPath: function (
    points: Array<{ x: number; y: number } | string>
  ) {
    let point: any,
      curCommand: SmoothGeodesicSVGCommand = "M",
      str = ""
    for (let i = 0; i < points.length; i++) {
      point = points[i]
      if (typeof point == "string" && this._isCurveSVGCommand(point)) {
        curCommand = point as SmoothGeodesicSVGCommand
        str += curCommand
      } else {
        switch (curCommand) {
          case "H":
            str += (point.x as number) + " "
            break
          case "V":
            str += (point.y as number) + " "
            break
          default:
            str += point.x + "," + point.y + " "
            break
        }
      }
    }
    return str || "M0 0"
  },

  beforeAdd: function (map: L.Map) {
    L.Path.prototype.beforeAdd?.call(this, map)
  },

  onAdd: function (map: L.Map) {
    L.Path.prototype.onAdd.call(this, map) // calls _update()

    if (this.options.animate && this._path.animate) {
      const length = this._svgSetDashArray()
      // If there is a delay property, immediately set strokeDashoffset so that the curve doesn't appear until the delay is up.
      if (this.options.animate.delay) {
        this._path.animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: length }],
          {
            duration: this.options.animate.delay
          }
        )
      }
      this._path.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        this.options.animate
      )
    }
  },

  // SVG specific logic
  _updateCurveSvg: function () {
    this._renderer._setPath(this, this._curvePointsToPath(this._points))

    if (this.options.animate) {
      this._svgSetDashArray()
    }
  },

  _svgSetDashArray: function () {
    const path = this._path
    const length = path.getTotalLength()

    if (!this.options.dashArray) {
      path.style.strokeDasharray = length + " " + length
    }
    return length
  }
})

L.smoothGeodesic = function (path, options) {
  return new L.SmoothGeodesic(path, options)
}