import { IExportStrategy } from '../Export/index'
import { Particle } from '../Shapes/Particle'
import { ColorState } from './ColorState/index'
import { OriginalColorState } from './ColorState/states'

export abstract class BGDrawer {
    constructor(
      protected  ctx: CanvasRenderingContext2D, 
      protected canvas: HTMLCanvasElement,
      protected val: string 
    ){}
    abstract drawBG():void
    abstract getNew(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
    ):BGDrawer
}

export class ColorBGDrawer extends BGDrawer{
    drawBG(): void {
        this.ctx.fillStyle = this.val
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    
    getNew(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): BGDrawer {
        return new ColorBGDrawer(
            ctx,
            canvas,
            this.val
        )
    }
}

// export const colorFactory = (mode: COLORS, particle: Particle) => {
//     switch(mode){
//     case 'black':
//         return '#000000'
//     case 'grayscale':
//         return particle.pixel.color.getGrayScale()
//     case 'invert':
//         return particle.pixel.color.getInvert()
//     case 'original':
//         return particle.pixel.color.getRGB()
//     }
// }



export abstract class  IAppState {
    protected inputText: string = ''
    abstract bgDrawer: BGDrawer
    protected colorMode: ColorState = new OriginalColorState()
    constructor(
        protected ctx: CanvasRenderingContext2D,
        protected canvas: HTMLCanvasElement,
        protected particls: Particle[],
        protected exportStrategy: IExportStrategy
    ){}
    abstract draw(): void
    abstract setParticleRadius(r: number): void

    setTextInput(text: string) {
        this.inputText = text
    }
    
    setBGDrawer = (drawer: BGDrawer) =>{
        this.bgDrawer = drawer
    }

    setHorzentalDeformity(val: number) {
        for(let i =0; i < this.particls.length; i++){
            this.particls[i].deformityX = val
        }
    }

    setExportStrategy(strategy: IExportStrategy){
        this.exportStrategy = strategy
    }

    setVerticalDeformity(val: number) {
        for(let i =0; i < this.particls.length; i++){
            this.particls[i].deformityY = val
        }
    }

    setColorMode(mode: ColorState){
        this.colorMode = mode
    }

    export() {
        this.exportStrategy.export(
            this.particls,
            this.bgDrawer,
            this.colorMode,
            this.canvas
        )
    }

    
}