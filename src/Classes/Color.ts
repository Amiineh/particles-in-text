export class Color {
    constructor(public r: number, public g: number ,public b: number, public a: number){}
    getGrayScale(){
        return 0.21 * this.r + 0.72 * this.g + 0.07 * this.b
    }
    getHSB(){
        const r = this.r/ 255
        const g = this.g/ 255
        const b = this.b /255
        const v = Math.max(r, g, b),
            n = v - Math.min(r, g, b)
        const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n
        return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100]
    }

    getRGB(){
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }

    getInvert(){
        return `rgb(${255 - this.r}, ${255 - this.g}, ${255 - this.b})` 
    }
}