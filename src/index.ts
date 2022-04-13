import "leaflet"
import { SmoothGeodesicPathData } from "../typings/smoothgeodesic"
declare module "leaflet" {
  export interface SmoothGeodesicOptions extends PathOptions {
    animate?: KeyframeAnimationOptions | number
  }
  export class SmoothGeodesic extends Path {
    constructor(pathData: SmoothGeodesicPathData, options: SmoothGeodesicOptions)

    // Public functions
    setPath(pathData: SmoothGeodesicPathData): this
    getPath(): SmoothGeodesicPathData
    getLatLngs(): SmoothGeodesicPathData
    setLatLngs(pathData: SmoothGeodesicPathData): this
  }

  export function smoothGeodesic(pathData: SmoothGeodesicPathData, options: SmoothGeodesicOptions): SmoothGeodesic
}
