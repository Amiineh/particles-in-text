import { Vector2 } from '../Vector2'
import { Shape } from './Shape'

export class Circle extends Shape {
  constructor(
    private radius: number,
    public pos: Vector2,
    public color: string,
    protected ctx: CanvasRenderingContext2D
  ){
    super(pos, color, ctx)
    this.radius = radius
  }
  draw(): void {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }
}