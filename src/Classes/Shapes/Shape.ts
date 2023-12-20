import { Vector2 } from "../Vector2";

export abstract class Shape {
  constructor(
    public pos: Vector2,
    public color: string,
    protected ctx: CanvasRenderingContext2D
  ){}
  abstract draw():void
}