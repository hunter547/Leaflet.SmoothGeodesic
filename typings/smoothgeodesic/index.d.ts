export interface SmoothGeodesicOptions extends L.PathOptions {
  animate?: KeyframeAnimationOptions | number
}

export type Coordinate = L.LatLng | [number, number]