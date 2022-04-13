import * as L from 'leaflet'
import arc from "arc"
import { greatCircleCoordinates } from './types-resolver'
import { Coordinate, SmoothGeodesicOptions } from '../typings/smoothgeodesic'

export class SmoothGeodesicClass extends L.Path {
    coords: Coordinate[] = [] as Coordinate[]
    constructor(origin: Coordinate, destination: Coordinate, verticies:number, options?: SmoothGeodesicOptions) {
        super(options || {})
        this.generateCoordinates(origin, destination, verticies)
    }
    private generateCoordinates(origin: Coordinate, destination: Coordinate, verticies:number): void {
        const generator = new arc.GreatCircle(greatCircleCoordinates(origin), greatCircleCoordinates(destination))
        const { geometries } = generator.Arc(verticies)
        if (!geometries[0]?.coords) {
            throw `The coords ${origin} and ${destination} are malformed. Please use format [number, number] (i.e. [0, 0]) for the coordinates.`
        }
        this.coords = geometries[0].coords
        this.catmullRom2bezier(origin)
    }

    // Catmull-Rom curves to bezier curve
    // Adaptation of Doug Schepers solution: http://schepers.cc/getting-to-the-point
    // Demo: http://schepers.cc/svg/path/dotty.svg
    private catmullRom2bezier(
      origin: Coordinate
    ): Coordinate[] {
      const catmullPathArray: Coordinate[] = [origin]
      const crp: number[] = this.coords.flat() as number[]
    
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
          [bp[1].x, bp[1].y],
          [bp[2].x, bp[2].y],
          [bp[3].x, bp[3].y]
        )
      }
    
      return catmullPathArray
    }
}