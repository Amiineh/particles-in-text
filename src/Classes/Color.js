export class Color {
    constructor(r, g, b, a) {
        Object.defineProperty(this, "r", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: r
        });
        Object.defineProperty(this, "g", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: g
        });
        Object.defineProperty(this, "b", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: b
        });
        Object.defineProperty(this, "a", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: a
        });
    }
    getGrayScale() {
        return 0.21 * this.r + 0.72 * this.g + 0.07 * this.b;
    }
    getHSB() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const v = Math.max(r, g, b), n = v - Math.min(r, g, b);
        const h = n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
        return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
    }
    getRGB() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    getInvert() {
        return `rgb(${255 - this.r}, ${255 - this.g}, ${255 - this.b})`;
    }
}
