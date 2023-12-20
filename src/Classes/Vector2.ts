export class Vector2 {
    public mag: number
    constructor(public x: number, public y: number){
        this.x = x
        this.y = y
        this.mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }

    dist = (v: Vector2) => {
        return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2))
    }
    add = (v: Vector2) =>{
        this.x = this.x + v.x
        this.y = this.y + v.y
    }

    getArrayIndex = (colLength: number) => {
        return (this.y  * colLength) + this.x
    }

    setX(x: number){
        this.x = x
        this.mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    setY(x: number){
        this.x = x
        this.mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    setAngle(angle: number){
        this.x = this.mag * Math.cos(angle)
        this.y = this.mag * Math.sin(angle)
    }

    getAngle(){
        return Math.atan2(this.y , this.x)
    }
    getReverseAngle(){
        return Math.atan2(this.y , this.x) + Math.PI
    }

    getMag(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    setLength(length:number){
        const angle = this.getAngle()
        this.x = length * Math.cos(angle)
        this.y = length * Math.sin(angle)
        this.mag = length
    }

}

export const vect2Addd = (v1: Vector2, v2: Vector2) =>  new Vector2(v1.x + v2.x, v1.y + v2.y)

export const dist = (v1: Vector2, v2: Vector2) => Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y,2))
