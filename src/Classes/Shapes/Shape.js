export class Shape {
    constructor(pos, color, ctx) {
        Object.defineProperty(this, "pos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pos
        });
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: color
        });
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ctx
        });
    }
}
