import { LatLng, PathOptions, Path } from "leaflet";
export type Coordinates = LatLng | [number, number];
export type SmoothGeodesicLatLngExpression = [number, number] | [number];

export type SmoothGeodesicSVGCommand =
	| "M"
	| "L"
	| "H"
	| "V"
	| "C"
	| "S"
	| "Q"
	| "T"
	| "Z";

export type SmoothGeodesicPathDataElement =
	| SmoothGeodesicLatLngExpression
	| SmoothGeodesicSVGCommand;
export type SmoothGeodesicPathData = SmoothGeodesicPathDataElement[];

export interface SmoothGeodesicLatLngControlPoints extends LatLng {
	controlPoint?: LatLng;
	controlPoint1?: LatLng;
	controlPoint2?: LatLng;
}
declare module "leaflet" {
	export interface SmoothGeodesicOptions extends PathOptions {
		animate?: KeyframeAnimationOptions | number;
		fitBounds?: FitBoundsOptions | boolean;
	}
	export class SmoothGeodesic extends Path {
		constructor(
			origin: L.LatLng | [number, number],
			destination: L.LatLng | [number, number],
			midpointCalculations: number,
			options?: SmoothGeodesicOptions
		);
	}

	export function smoothGeodesic(
		origin: L.LatLng | [number, number],
		destination: L.LatLng | [number, number],
		midpointCalculations: number,
		options?: SmoothGeodesicOptions
	): SmoothGeodesic;
}
