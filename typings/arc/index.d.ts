// No arc type file, have to create one

type ArcCoordinate = {
    x: number,
    y:number
}

type LineString = {
    coords: [number, number][]
    length: number
}


declare module 'arc' {
    class GreatCircle {
        constructor(start: ArcCoordinate, end:ArcCoordinate)
        Arc(verticies:number): { geometries: LineString[], properties: {} }
    }
}
