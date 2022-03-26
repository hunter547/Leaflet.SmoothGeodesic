// No arc type file, have to create one

interface Coordinate {
    x: number,
    y: number
}

declare module 'arc' {
    class GreatCircle {
        constructor(start: Coordinate, end:Coordinate)
        Arc(verticies:number): { coords: [number,number][], length:number }
    }
}
