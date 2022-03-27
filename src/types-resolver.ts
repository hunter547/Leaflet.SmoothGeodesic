import { LatLng } from "leaflet"
import { Coordinate } from "../typings/smoothgeodesic"

export function greatCircleCoordinates(coordinate: Coordinate): { x: number, y:number } {
    return coordinate instanceof LatLng ? { x: coordinate.lat, y: coordinate.lng } : { x: coordinate[0], y: coordinate[1] }
}