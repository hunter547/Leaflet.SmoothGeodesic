import { LatLng } from "leaflet";
import { Coordinates } from "../typings/smoothgeodesic";

export function greatCircleCoordinates(coordinate: LatLng | [number, number]): Coordinates {
    return coordinate instanceof LatLng ? [coordinate.lat, coordinate.lng] : coordinate
}