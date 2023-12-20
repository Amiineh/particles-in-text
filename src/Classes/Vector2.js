export class Vector2 {
    constructor(x, y) {
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
        Object.defineProperty(this, "mag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dist", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (v) => {
                return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
            }
        });
        Object.defineProperty(this, "add", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (v) => {
                this.x = this.x + v.x;
                this.y = this.y + v.y;
            }
        });
        Object.defineProperty(this, "getArrayIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (colLength) => {
                return (this.y * colLength) + this.x;
            }
        });
        this.x = x;
        this.y = y;
        this.mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    setX(x) {
        this.x = x;
        this.mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    setY(x) {
        this.x = x;
        this.mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    setAngle(angle) {
        this.x = this.mag * Math.cos(angle);
        this.y = this.mag * Math.sin(angle);
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    getReverseAngle() {
        return Math.atan2(this.y, this.x) + Math.PI;
    }
    getMag() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    setLength(length) {
        const angle = this.getAngle();
        this.x = length * Math.cos(angle);
        this.y = length * Math.sin(angle);
        this.mag = length;
    }
}
export const vect2Addd = (v1, v2) => new Vector2(v1.x + v2.x, v1.y + v2.y);
export const dist = (v1, v2) => Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
