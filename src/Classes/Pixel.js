export class Pixel {
    constructor(x, y, color) {
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: color
        });
    }
    getHSB() {
        const r = this.color.r / 255;
        const g = this.color.g / 255;
        const b = this.color.b / 255;
        const v = Math.max(r, g, b), n = v - Math.min(r, g, b);
        const h = n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
        return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
    }
}
