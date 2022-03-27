import * as L from 'leaflet'
import arc from "arc"
import { greatCircleCoordinates } from './types-resolver'

export interface SmoothGeodesicOptions extends L.PathOptions {
    animate?: KeyframeAnimationOptions | number
}

export class SmoothGeodesicClass extends L.Path {
    constructor(origin: L.LatLng | [number, number], destination: L.LatLng | [number, number], verticies:number, options?: SmoothGeodesicOptions) {
        super(options || {})
        this.generateCoordinates(origin, destination, verticies)
    }
    private generateCoordinates(origin: L.LatLng | [number, number], destination: L.LatLng | [number, number], verticies:number): void {
        const generator = new arc.GreatCircle(greatCircleCoordinates(origin), greatCircleCoordinates(destination))
        const arcObject = generator.Arc(verticies)
    }
}