import * as L from "leaflet"

declare module "leaflet" {
    class SmoothGeodesic extends L.Path {
        
    }
}