import * as L from 'leaflet'
import arc from "arc"
import { greatCircleCoordinates } from './types-resolver'
import { Coordinate, SmoothGeodesicOptions } from '../typings/smoothgeodesic'

export class SmoothGeodesicClass extends L.Path {
    constructor(origin: Coordinate, destination: Coordinate, verticies:number, options?: SmoothGeodesicOptions) {
        super(options || {})
        this.generateCoordinates(origin, destination, verticies)
    }
    private generateCoordinates(origin: Coordinate, destination: Coordinate, verticies:number): void {
        const generator = new arc.GreatCircle(greatCircleCoordinates(origin), greatCircleCoordinates(destination))
        const arcObject = generator.Arc(verticies)
    }
}