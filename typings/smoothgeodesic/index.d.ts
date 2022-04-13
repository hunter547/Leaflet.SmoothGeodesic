import { LatLng } from "leaflet"
export type Coordinates = [number, number]
export type SmoothGeodesicLatLngExpression = [number, number] | [number]

// SVG Command Types
export type SmoothGeodesicSVGCommand =
  | "M"
  | "L"
  | "H"
  | "V"
  | "C"
  | "S"
  | "Q"
  | "T"
  | "Z"

// PathData consists of SVG command followed by their lat/lng parameters
export type SmoothGeodesicPathDataElement = SmoothGeodesicLatLngExpression | SmoothGeodesicSVGCommand
export type SmoothGeodesicPathData = SmoothGeodesicPathDataElement[]

export interface SmoothGeodesicLatLngControlPoints extends LatLng {
  controlPoint?: LatLng
  controlPoint1?: LatLng
  controlPoint2?: LatLng
}