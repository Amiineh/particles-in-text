import { OriginalColorState } from './ColorState/states';
export class BGDrawer {
    constructor(ctx, canvas, val) {
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ctx
        });
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: canvas
        });
        Object.defineProperty(this, "val", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: val
        });
    }
}
export class ColorBGDrawer extends BGDrawer {
    drawBG() {
        this.ctx.fillStyle = this.val;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getNew(ctx, canvas) {
        return new ColorBGDrawer(ctx, canvas, this.val);
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
export class IAppState {
    constructor(ctx, canvas, particls, exportStrategy) {
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ctx
        });
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: canvas
        });
        Object.defineProperty(this, "particls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: particls
        });
        Object.defineProperty(this, "exportStrategy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exportStrategy
        });
        Object.defineProperty(this, "colorMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new OriginalColorState()
        });
        Object.defineProperty(this, "setBGDrawer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (drawer) => {
                this.bgDrawer = drawer;
            }
        });
    }
    setHorzentalDeformity(val) {
        for (let i = 0; i < this.particls.length; i++) {
            this.particls[i].deformityX = val;
        }
    }
    setExportStrategy(strategy) {
        this.exportStrategy = strategy;
    }
    setVerticalDeformity(val) {
        for (let i = 0; i < this.particls.length; i++) {
            this.particls[i].deformityY = val;
        }
    }
    setColorMode(mode) {
        this.colorMode = mode;
    }
    export() {
        this.exportStrategy.export(this.particls, this.bgDrawer, this.colorMode, this.canvas);
    }
}
