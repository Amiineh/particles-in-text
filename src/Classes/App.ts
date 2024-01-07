// export type interactiveData = {
//   mouseX: number
//   mouseY: number
// }

import { AppState } from '../main'
import { Color } from './Color'
import { JPEGExportStrategy, PNGExportStrategy, SVGExportStrategy } from './Export/index'
import { Pixel } from './Pixel'
import { Particle } from './Shapes/Particle'
import { BlackColorState, CustomColorState, GrayScaleColorState, InvertColorState, OriginalColorState } from './states/ColorState/states'
import { ImageUploadedState, TextInsertedState } from './states/ImageUploadedState'
import { InitialState } from './states/InitialState'
import { ColorBGDrawer, IAppState } from './states/types'
// @ts-ignore
import PoissonDiskSampling from 'poisson-disk-sampling'

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


const colorModeFactory = (state: AppState) => {
    switch(state['COLOR']){
    case 'black':{
        return new BlackColorState()
    }

    case 'grayscale':{
        return new GrayScaleColorState()
    }

    case 'original':{
        return new OriginalColorState()
    }

    case 'invert': {
        return new InvertColorState() 
    }

    case 'custom': {
        return new CustomColorState(state['DOT_COLOR'])
    }

    }
}

class IMGUtils {
    private constructor(){}

    static drawText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string, state: AppState, callback: () => void){
        const img = this.createTextImage(text, state)
        img.onload = function () {
            const scale = img.width / img.height

            if(img.width > window.innerWidth){
                img.width = window.innerWidth
                img.height = img.width / scale  
            }

            if(img.height > window.innerHeight){
                img.height = window.innerHeight
                img.width = img.height * scale 
            }

            canvas.width = img.width
            canvas.height = img.height
            
            ctx.drawImage(
                img, 
                0,
                0, 
                img.width, 
                img.height
            )
            callback()
        }
    }


    static drawImg(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, url: string, callback: () => void){
        const img = new Image()
        img.src = url
        img.onload = function () {
            const scale = img.width / img.height

            if(img.width > window.innerWidth){
                img.width = window.innerWidth
                img.height = img.width / scale  
            }

            if(img.height > window.innerHeight){
                img.height = window.innerHeight
                img.width = img.height * scale 
            }

            canvas.width = img.width
            canvas.height = img.height

            ctx.drawImage(
                img, 
                0,
                0, 
                img.width, 
                img.height
            )
            callback()
        }
    }

    static createTextImage(text: string, state:AppState): HTMLImageElement {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Context not supported');
        }

        const textWidth = ctx.measureText(text).width * (state['FONT_SIZE'] / 10);
        const canvasWidth = textWidth + 20; // Add some padding
        const canvasHeight = 140 + state['FONT_SIZE'] /10 ; // Set the canvas height

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Set the canvas background to white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load the font using @font-face rule
        const fontFile = 'XXAAVV83-Bold.ttf'
        const fontSize = String(state['FONT_SIZE']) + 'px'
        console.log(state['FONT_SIZE'])
        const fontFace = new FontFace('CustomFont', `url(${fontFile})`);
        fontFace.load().then(() => {
            document.fonts.add(fontFace);
        })
            
        ctx.font = fontSize + ' CustomFont';
        
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

        const img = new Image();
        img.src = canvas.toDataURL();

        // // Append the image element to the body
        // // document.body.appendChild(img);
        // const parentElem = document.body;
        // const oldImg = parentElem.querySelector('img');
        // if (oldImg) {
        //     parentElem.replaceChild(img, oldImg);
        // } else {
        //     parentElem.appendChild(img);
        // }

        return img;
    }

    // static createTextImageData(text: string, state: AppState): ImageData {
    //     const img = this.createTextImage(text, state);
    //     const canvas = document.createElement('canvas');
    //     const ctx = canvas.getContext('2d');
    //     if (!ctx) {
    //         throw new Error('Context not supported');
    //     }

    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     ctx.drawImage(img, 0, 0);

    //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     return imageData;
    // }

    static converImageDataToParticles(imageData:ImageData, state: AppState){
        const pds = new PoissonDiskSampling({
            shape: [imageData.width, imageData.height],
            minDistance: state['DENSITY'],
            maxDistance: 10,
            tries: 10,
            distanceFunction: function (point: any) {
                // get the index of the red pixel value for the given coordinates (point)
                const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4
                const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1
                const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2
                const Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 3
                const color = new Color(
                    imageData.data[Rindex],
                    imageData.data[Gindex],
                    imageData.data[Bindex],
                    imageData.data[Aindex]
                )
                // map the value to 0-1 and apply Math.pow for flavor
                return Math.pow(color.getGrayScale() / 200, 2.7)
            }
        })
        const points = pds.fill()
        const particles: Particle[] = []


        for(let i =0; i < points.length; i++){
            const point = points[i]
            const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4
            const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1
            const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2
            const Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 3
            const color = new Color(
                imageData.data[Rindex],
                imageData.data[Gindex],
                imageData.data[Bindex],
                imageData.data[Aindex]
            )
            const pixel = new Pixel(
                point[0],
                point[1],
                color
            )
            const particle = new Particle(
                state['SIZE'],
                pixel,
            ) 
            particles.push(particle)
        }

        return particles
    }
    
}

export class App {
    private containerElem: Element
    private canvas: HTMLCanvasElement
    private ctx:CanvasRenderingContext2D
    private state: IAppState
    private url: string | null = null
     
    constructor(
        containerSelecor: string,
    ){
        const container = document.querySelector(containerSelecor)
        if(!container){
            throw new Error('No Container element found')
        }
        this.containerElem = container
        this.canvas = document.createElement('canvas')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        const context = this.canvas.getContext('2d')
        if(!context){
            throw new Error('Context not supported')
        }
        this.ctx = context
        this.state = new InitialState(
            this.ctx,
            this.canvas,
            [],
            new JPEGExportStrategy()
        )
    }

    draw(){
        this.state.draw()
    }

    getImageData(){
        return this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height)
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    goToTextInsertedState = (state: AppState) => {
        const textInput = state['TEXT_INPUT'];

        // console.log(textInput); // Print text_input in the log

        // // Display text_input in big fonts on the screen
        // const bigTextElement = document.createElement('div');
        // bigTextElement.style.fontSize = '48px';
        // bigTextElement.style.fontWeight = 'bold';
        // bigTextElement.textContent = textInput;
        // this.containerElem.appendChild(bigTextElement);

        // console.log("goToTextInsertedState")
        
        const cb = () => {
            const imageData = this.getImageData() 
            // const imageData = IMGUtils.createTextImageData(textInput)
            const particles = IMGUtils.converImageDataToParticles(imageData, state)
            this.state = new TextInsertedState(
                this.ctx,
                this.canvas,
                particles,
                new JPEGExportStrategy()
            )
            const mode = colorModeFactory(state)
            this.state.setColorMode(mode)
            this.clearCanvas()
            this.state.draw()
        }

        IMGUtils.drawText(this.ctx, this.canvas, textInput, state, cb)
    }

    goToImageUploadedState = (url: string, state:AppState) =>{
        const cb = () => {
            const imageData = this.getImageData()
            const particles = IMGUtils.converImageDataToParticles(imageData, state)
            this.state = new ImageUploadedState(
                this.ctx,
                this.canvas, 
                particles,
                new JPEGExportStrategy()
            )
            const mode = colorModeFactory(state)
            this.state.setColorMode(mode)
            this.clearCanvas()
            this.state.draw()
            this.url = url
        }

        IMGUtils.drawImg(this.ctx, this.canvas, url, cb)
    }

    setParticleDensity = (state: AppState) => {
        this.clearCanvas()
        if(this.url)
            this.goToImageUploadedState(this.url, state)

        else
            this.goToTextInsertedState(state)
    }

    setFontSize = (state: AppState) => {
        this.clearCanvas()
        this.goToTextInsertedState(state)
    }

    setTextInput = (state: AppState) => {
        this.state.setTextInput(state['TEXT_INPUT'])
        this.clearCanvas()
        this.state.draw()
    }

    setParticleRadius = (state: AppState) => {
        this.state.setParticleRadius(state['SIZE'])
        this.clearCanvas()
        this.state.draw()
    }
    
    setCanvasBG = (state: AppState) => {
        const bgDrawer = new ColorBGDrawer(this.ctx, this.canvas, state['BG_COLOR'])
        this.state.setBGDrawer(bgDrawer)
        this.clearCanvas()
        this.state.draw()
    }

    setHorizentalDeformity = (state: AppState) => {
        this.state.setHorzentalDeformity(state['MOVE_HORIZENTAL'])
        this.clearCanvas()
        this.state.draw()
    }

    setVerticalDeformity = (state: AppState) => {
        this.state.setVerticalDeformity(state['MOVE_VERTICAL'])
        this.clearCanvas()
        this.state.draw()
    }

    setDotColorMode = (state: AppState) =>{
        const mode = colorModeFactory(state)
        this.state.setColorMode(mode)
        this.clearCanvas()
        this.state.draw()
    }

    exportJPG = () => {
        const strategy = new JPEGExportStrategy()
        this.state.setExportStrategy(strategy)
        this.state.export()
    }

    exportPNG = () => {
        const strategy = new PNGExportStrategy()
        this.state.setExportStrategy(strategy)
        this.state.export()
    }

    exportSVG = () => {
        const strategy = new SVGExportStrategy()
        this.state.setExportStrategy(strategy)
        this.state.export()
    }

    init() {
        this.canvas.setAttribute('id', 'scene')
        this.containerElem.appendChild(this.canvas)
    }

}