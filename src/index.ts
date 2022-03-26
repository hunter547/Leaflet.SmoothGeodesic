import "leaflet"
import { SmoothGeodesicClass } from "./smoothgeodesic"

declare module "leaflet" {
    type SmoothGeodesic = SmoothGeodesicClass
    let SmoothGeodesic: typeof SmoothGeodesicClass
    let smoothGeodesic: (...args: ConstructorParameters<typeof SmoothGeodesicClass>) => SmoothGeodesicClass
}

if (typeof window.L !== "undefined") {
    window.L.SmoothGeodesic = SmoothGeodesicClass;
    window.L.smoothGeodesic = (...args: ConstructorParameters<typeof SmoothGeodesicClass>) => new SmoothGeodesicClass(...args);
}

new SmoothGeodesicClass([0, 0], [0, 50], 100)

export * from "./smoothgeodesic"