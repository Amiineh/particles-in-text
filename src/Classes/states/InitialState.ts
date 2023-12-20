import { BGDrawer, ColorBGDrawer, IAppState } from './types'

export class InitialState extends IAppState {
    bgDrawer: BGDrawer = new ColorBGDrawer(this.ctx, this.canvas, '#FFF')

    draw(): void {
        return
    }
    setParticleRadius(_: number): void {
        return
    }

} 