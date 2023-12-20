import { ColorBGDrawer, IAppState } from './types';
export class ImageUploadedState extends IAppState {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "bgDrawer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ColorBGDrawer(this.ctx, this.canvas, '#FFF')
        });
    }
    draw() {
        this.bgDrawer.drawBG();
        for (let i = 0; i < this.particls.length; i++) {
            const particle = this.particls[i];
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.colorMode.getColor(particle);
            this.ctx.arc(particle.pos.x + particle.deformityX, particle.pos.y + particle.deformityY, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    setParticleRadius(r) {
        for (let i = 0; i < this.particls.length; i++) {
            this.particls[i].radius = r;
        }
    }
}
