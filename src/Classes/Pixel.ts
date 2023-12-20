import { Color } from './Color'

export class Pixel {
    constructor(
      public x: number, 
      public y: number, 
      public color: Color
    ){}
    getHSB(){
        const r = this.color.r/ 255
        const g = this.color.g/ 255
        const b = this.color.b /255
        const v = Math.max(r, g, b),
            n = v - Math.min(r, g, b)
        const h =
      n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n
        return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100]
    }


}