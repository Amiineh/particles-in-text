import { BGDrawer, ColorBGDrawer, IAppState } from './types'

export class ImageUploadedState extends IAppState {
    bgDrawer: BGDrawer = new ColorBGDrawer(this.ctx, this.canvas, '#FFF')
    draw(): void {
        this.bgDrawer.drawBG()
        for(let i = 0; i < this.particls.length; i++){
            const particle = this.particls[i]
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.fillStyle = this.colorMode.getColor(particle)
            this.ctx.arc(
                particle.pos.x + particle.deformityX,
                particle.pos.y + particle.deformityY,
                particle.radius, 
                0, 
                Math.PI * 2
            )
            this.ctx.fill()
            this.ctx.restore()
        }
    }

    setParticleRadius(r: number): void {
        for(let i = 0; i<this.particls.length; i++){
            this.particls[i].radius = r
        }
    }
} 