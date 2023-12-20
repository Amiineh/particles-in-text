import { Vector2 } from '../Vector2'
import { Pixel } from '../Pixel'
import { generateRandomInt } from '../../utils/generateRandomInt'
import { generateRandomSign } from '../../utils/index'


// export class Particle {
//     private phaseShift: number = generateRandomNumber(0, 2 * Math.PI)
//     private friction: number = 0.97
//     public pos: Vector2
//     private deformity_x: number
//     private deformity_y: number
//     constructor(
//     private radius: number,
//     private pixel :Pixel,
//     private colorType: COLORS = 'black',
//     private color: string,
//     protected ctx: CanvasRenderingContext2D,
//     public acceleration: Vector2 = new Vector2(0, 0),
//     public speed: Vector2 = new Vector2(0, 0),
//     deformity_X: number = 0,
//     deformity_Y: number = 0
//     ){
//         this.deformity_x = (generateRandomSign() * generateRandomInt(0, deformity_X))
//         this.deformity_y = (generateRandomSign() * generateRandomInt(0, deformity_Y))
//         this.pixel.x = this.pixel.x 
//         this.pixel.y = this.pixel.y
//         this.pos = new Vector2(this.pixel.x, this.pixel.y)
//     }

//     generateColor = () => {
//         if(this.colorType === 'original'){
//             return `rgb(${this.pixel.r}, ${this.pixel.g}, ${this.pixel.b})`
//         }
//         if(this.colorType === 'black'){
//             return 'black'
//         }

//         if(this.colorType === 'invert'){
//             return `rgb(${255 - this.pixel.r}, ${255 - this.pixel.g}, ${255 - this.pixel.b})`
//         }
//         if(this.colorType === 'grayscale'){
//             const grayScale = this.pixel.getGrayScale()
//             return `rgb(${grayScale}, ${grayScale}, ${grayScale})`
//         }
//         if(this.colorType === 'custom'){
//             return this.color
//         }
//         return 'black'
//     }

//     draw(
//         time: number = 0, 
//         data: interactiveData, 
//         animate: boolean, 
//         uneasey: boolean, 
//         viggleRoom: number = 2,
//     ): void {
//         this.ctx.save()
//         this.ctx.beginPath()

//         if(animate){
//             const mousePos = new Vector2(data.mouseX, data.mouseY)
//             const pixelPos = new Vector2(this.pixel.x, this.pixel.y)
//             const distanceToorigin = this.pos.dist(pixelPos)
//             this.acceleration.setAngle(
//                 Math.atan2(pixelPos.y - this.pos.y, pixelPos.x - this.pos.x)
//             )
//             this.speed.add(this.acceleration)
      
//             this.speed.setLength(this.speed.getMag() * this.friction)
  
//             if(this.speed.getMag() < 0.1 && distanceToorigin < 2){
//                 this.speed.setLength(0)
//             }
  
//             if(this.pos.dist(mousePos) < 50){
//                 this.speed.setLength(10)
//                 this.speed.setAngle(
//                     Math.atan2(this.pos.y - data.mouseY, this.pos.x - data.mouseX)
//                 )
//                 this.acceleration.setLength(0.1)
  
//             }
//             this.pos.add(this.speed)
//         }
//         this.ctx.fillStyle = this.generateColor()
//         if(uneasey){
//             this.ctx.arc(
//                 this.pos.x +  this.deformity_x  + Math.sin(time + this.phaseShift) * viggleRoom, 
//                 this.pos.y +  this.deformity_y +Math.cos(time + this.phaseShift) * viggleRoom, 
//                 this.radius,
//                 0,
//                 Math.PI * 2
//             )
//         }else{
//             this.ctx.arc(
//                 this.pos.x + this.deformity_x, 
//                 this.pos.y + this.deformity_y, 
//                 this.radius, 
//                 0, 
//                 Math.PI * 2
//             )
//         }
//         this.ctx.fill()
//         this.ctx.restore()
//     }

//     setDeformityX(amount: number){
//         this.deformity_x = (generateRandomSign() * generateRandomInt(0, amount))
//     }
//     setDeformityY(amount: number){
//         this.deformity_y = (generateRandomSign() * generateRandomInt(0, amount))
//     }
// }


export class Particle {
    public pos: Vector2
    constructor(
      public radius: number,
      public pixel :Pixel,
      private _deformityX: number = 0,
      private _deformityY: number = 0,
    ){
        this.pos = new Vector2(this.pixel.x, this.pixel.y)
    }

    set deformityX(val: number){
        this._deformityX = generateRandomSign() * generateRandomInt(0, val)
    }

    set deformityY(val: number){
        this._deformityY = generateRandomSign() * generateRandomInt(0, val)
    }

    get deformityX(){
        return this._deformityX
    }

    get deformityY(){
        return this._deformityY
    }
}