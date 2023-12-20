// export type interactiveData = {
//   mouseX: number
//   mouseY: number
// }
import { Color } from './Color';
import { JPEGExportStrategy, PNGExportStrategy, SVGExportStrategy } from './Export/index';
import { Pixel } from './Pixel';
import { Particle } from './Shapes/Particle';
import { BlackColorState, CustomColorState, GrayScaleColorState, InvertColorState, OriginalColorState } from './states/ColorState/states';
import { ImageUploadedState } from './states/ImageUploadedState';
import { InitialState } from './states/InitialState';
import { ColorBGDrawer } from './states/types';
// @ts-ignore
import PoissonDiskSampling from 'poisson-disk-sampling';
// type drawFNType = (time: number,context: CanvasRenderingContext2D, canvas: HTMLCanvasElement,data:interactiveData )=>void
// type initFNType = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, app: App)=>void
// export class App{
//   public canvas: HTMLCanvasElement
//   public container: HTMLElement
//   private loopRunning: boolean
//   private FRAMES_PER_SECOND = 10000
//   private FRAME_MIN_TIME = (1000/60) * (60 / this.FRAMES_PER_SECOND) - (1000/60) * 0.5
//   private lastFrameTime = 0
//   private context:CanvasRenderingContext2D
//   constructor(
//     containerID: string, 
//     public drawFN: drawFNType, 
//     startLoop: boolean = true,
//     private mouseX: number = 0,
//     private mouseY: number =0
//   ){
//     const containerElem: HTMLCanvasElement | null = document.querySelector(`#${containerID}`)
//     if(!containerElem){
//       throw new Error("No Container Found!")
//     }
//     this.container = containerElem
//     this.canvas = document.createElement("canvas")
//     this.canvas.width = window.innerWidth
//     this.canvas.height = window.innerHeight
//     this.canvas.addEventListener('mousemove', (e) => {
//       this.mouseX = e.offsetX
//       this.mouseY = e.offsetY
//     })
//     const context = this.canvas.getContext("2d")
//     if(!context){
//       throw new Error("Can't create context!")
//     }
//     this.context = context
//     this.loopRunning = startLoop
//   }
//   update = (time: number) => {
//     if(time - this.lastFrameTime < this.FRAME_MIN_TIME){ 
//         if(this.loopRunning){
//           requestAnimationFrame(this.update)
//         }
//         return
//     }
//     this.lastFrameTime = time; 
//     this.drawFN(time, this.context, this.canvas, {
//       mouseX: this.mouseX,
//       mouseY: this.mouseY
//     })
//     if(this.loopRunning){
//       requestAnimationFrame(this.update)
//     }
//   }
//   startLoop = () => {
//     this.loopRunning = true
//     requestAnimationFrame(this.update)
//   }
//   stopLoop = () => {
//     this.loopRunning = false
//   }
//   start = (
//     initiFN: initFNType = () => {}
//   ) => {
//     this.canvas.setAttribute("id", "scene")
//     this.container.appendChild(this.canvas)
//     initiFN(this.context, this.canvas, this)
//     if(this.loopRunning){
//       this.startLoop()
//     }
//   }
//   call = (
//     FN: initFNType
//   ) => {
//     FN(this.context, this.canvas, this)
//   }
// }
const colorModeFactory = (state) => {
    switch (state['COLOR']) {
        case 'black': {
            return new BlackColorState();
        }
        case 'grayscale': {
            return new GrayScaleColorState();
        }
        case 'original': {
            return new OriginalColorState();
        }
        case 'invert': {
            return new InvertColorState();
        }
        case 'custom': {
            return new CustomColorState(state['DOT_COLOR']);
        }
    }
};
class IMGUtils {
    constructor() { }
    static drawImg(ctx, canvas, url, callback) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            const scale = img.width / img.height;
            if (img.width > window.innerWidth) {
                img.width = window.innerWidth;
                img.height = img.width / scale;
            }
            if (img.height > window.innerHeight) {
                img.height = window.innerHeight;
                img.width = img.height * scale;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            callback();
        };
    }
    static converImageDataToParticles(imageData, state) {
        const pds = new PoissonDiskSampling({
            shape: [imageData.width, imageData.height],
            minDistance: state['DENSITY'],
            maxDistance: 55,
            tries: 10,
            distanceFunction: function (point) {
                // get the index of the red pixel value for the given coordinates (point)
                const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4;
                const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1;
                const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2;
                const Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 3;
                const color = new Color(imageData.data[Rindex], imageData.data[Gindex], imageData.data[Bindex], imageData.data[Aindex]);
                // map the value to 0-1 and apply Math.pow for flavor
                return Math.pow(color.getGrayScale() / 200, 2.7);
            }
        });
        const points = pds.fill();
        const particles = [];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4;
            const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1;
            const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2;
            const Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 3;
            const color = new Color(imageData.data[Rindex], imageData.data[Gindex], imageData.data[Bindex], imageData.data[Aindex]);
            const pixel = new Pixel(point[0], point[1], color);
            const particle = new Particle(state['SIZE'], pixel);
            particles.push(particle);
        }
        return particles;
    }
}
export class App {
    constructor(containerSelecor) {
        Object.defineProperty(this, "containerElem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "goToImageUploadedState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, state) => {
                const cb = () => {
                    const imageData = this.getImageData();
                    const particles = IMGUtils.converImageDataToParticles(imageData, state);
                    this.state = new ImageUploadedState(this.ctx, this.canvas, particles, new JPEGExportStrategy());
                    const mode = colorModeFactory(state);
                    this.state.setColorMode(mode);
                    this.clearCanvas();
                    this.state.draw();
                    this.url = url;
                };
                IMGUtils.drawImg(this.ctx, this.canvas, url, cb);
            }
        });
        Object.defineProperty(this, "setParticleDensity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (state) => {
                if (this.url) {
                    this.clearCanvas();
                    const cb = () => {
                        const imageData = this.getImageData();
                        const particles = IMGUtils.converImageDataToParticles(imageData, state);
                        this.state = new ImageUploadedState(this.ctx, this.canvas, particles, new JPEGExportStrategy());
                        const mode = colorModeFactory(state);
                        this.state.setColorMode(mode);
                        this.clearCanvas();
                        this.state.draw();
                    };
                    IMGUtils.drawImg(this.ctx, this.canvas, this.url, cb);
                }
            }
        });
        Object.defineProperty(this, "setParticleRadius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (state) => {
                this.state.setParticleRadius(state['SIZE']);
                this.clearCanvas();
                this.state.draw();
            }
        });
        Object.defineProperty(this, "setCanvasBG", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (state) => {
                const bgDrawer = new ColorBGDrawer(this.ctx, this.canvas, state['BG_COLOR']);
                this.state.setBGDrawer(bgDrawer);
                this.clearCanvas();
                this.state.draw();
            }
        });
        Object.defineProperty(this, "setHorizentalDeformity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (state) => {
                this.state.setHorzentalDeformity(state['MOVE_HORIZENTAL']);
                this.clearCanvas();
                this.state.draw();
            }
        });
        Object.defineProperty(this, "setVerticalDeformity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (state) => {
                this.state.setVerticalDeformity(state['MOVE_VERTICAL']);
                this.clearCanvas();
                this.state.draw();
            }
        });
        Object.defineProperty(this, "setDotColorMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (state) => {
                const mode = colorModeFactory(state);
                this.state.setColorMode(mode);
                this.clearCanvas();
                this.state.draw();
            }
        });
        Object.defineProperty(this, "exportJPG", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const strategy = new JPEGExportStrategy();
                this.state.setExportStrategy(strategy);
                this.state.export();
            }
        });
        Object.defineProperty(this, "exportPNG", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const strategy = new PNGExportStrategy();
                this.state.setExportStrategy(strategy);
                this.state.export();
            }
        });
        Object.defineProperty(this, "exportSVG", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const strategy = new SVGExportStrategy();
                this.state.setExportStrategy(strategy);
                this.state.export();
            }
        });
        const container = document.querySelector(containerSelecor);
        if (!container) {
            throw new Error('No Container element found');
        }
        this.containerElem = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Context not supported');
        }
        this.ctx = context;
        this.state = new InitialState(this.ctx, this.canvas, [], new JPEGExportStrategy());
    }
    draw() {
        this.state.draw();
    }
    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    init() {
        this.canvas.setAttribute('id', 'scene');
        this.containerElem.appendChild(this.canvas);
    }
}
