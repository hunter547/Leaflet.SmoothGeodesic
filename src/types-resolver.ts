import { LatLng } from "leaflet";

export function greatCircleCoordinates(coordinate: LatLng | [number, number]): { x: number, y:number } {
    return coordinate instanceof LatLng ? { x: coordinate.lat, y: coordinate.lng } : { x: coordinate[0], y: coordinate[1] }
}