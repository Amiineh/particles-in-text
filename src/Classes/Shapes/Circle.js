import { Shape } from './Shape';
export class Circle extends Shape {
    constructor(radius, pos, color, ctx) {
        super(pos, color, ctx);
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
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
        this.radius = radius;
    }
    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}
