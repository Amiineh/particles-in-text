// import type { interactiveData } from './Classes/App'
import type { COLORS } from './types'

// import { App } from './Classes/App'
// import { Color } from './Classes/Color'
// import { Pixel } from './Classes/Pixel'
// import { Particle } from './Classes/Shapes/Particle'
// import { State } from './Classes/Controls'
// import { Vector2 } from './Classes/Vector2'
// // @ts-ignore
// import PoissonDiskSampling from 'poisson-disk-sampling'

import { App } from './Classes/App'
import './style.css'
import { StateManager } from './Classes/StateManager'
import { DatGuiStateNotifier } from './Classes/StateNotifier/DatGUIStateManager'

const initialState = {
    TEXT_INPUT: '',
    MAP_SCALE: 0.005,
    MAP_STRENGTH: 0.1,
    MIN_DIST: 1.9,
    DENSITY: 1.9,
    BG_COLOR: '#FFFFFF',
    DOT_COLOR: '#000000',
    COLOR: 'original' as COLORS,
    SIZE: 1,
    FONT_SIZE: 100,
    UNEAZYRANGE: 2,
    INTERACTION: false,
    UNEASY: false,
    MOVE_HORIZENTAL: 0,
    MOVE_VERTICAL: 0,
}

export type AppState = typeof initialState


// const URL: string | null = null

// const appState = new State()
// const controls = appState.subscribableStates


// function getImageData(ctx:CanvasRenderingContext2D ,canvas:HTMLCanvasElement  ,url: string, callback: (data: ImageData) => void) {
//     // load an image, draw it on a canvas, retrieve the pixel values / image data
//     // see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
//     const img = new Image()
//     img.onload = function () {
//         canvas.width = window.innerWidth
//         canvas.height = window.innerHeight
//         const scale = img.width / img.height

//         if(img.width > canvas.width){
        
//             img.width = canvas.width
//             img.height = img.width / scale
//         }

//         if(img.height < canvas.height){
//             canvas.height = img.height
//         }
      

//         const height = canvas.height
//         const width  = canvas.height * scale



//         ctx.drawImage(
//             img, 
//             0,
//             0, 
//             img.width, 
//             img.height,
//             0,
//             0,
//             canvas.width,
//             canvas.height
//         )
//         const imageData = ctx.getImageData(0, 0, width - 2, height - 2)

//         appState.setIMG(img)

//         callback(imageData)
//     }
//     img.src = url
//     ctx.clearRect(0,0,canvas.width, canvas.height)
// }

// let sample:Particle[] = []


// const drawFN = (time: number, ctx:CanvasRenderingContext2D, _canvas: HTMLCanvasElement, data: interactiveData)=> {
//     ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
//     ctx.fillStyle = controls.BG_COLOR
//     ctx.fillRect(0, 0, _canvas.width, _canvas.height)
//     if(sample.length > 0){
//         for(let i = 0; i < sample.length; i++){
//             sample[i].draw(time / 500, data, controls.INTERACTION, controls.UNEASY, controls.UNEAZYRANGE)
//         }
//     }
// }


// const setup = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
//     if(URL){
//         getImageData(ctx,canvas, URL, (imageData: ImageData) => {
//             const pds = new PoissonDiskSampling({
//                 shape: [imageData.width, imageData.height],
//                 minDistance: controls.MIN_DIST,
//                 maxDistance: 55,
//                 tries: 10,
//                 distanceFunction: function (point: any) {
//                     // get the index of the red pixel value for the given coordinates (point)
//                     const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4
//                     const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1
//                     const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2
//                     const color = new Color(
//                         imageData.data[Rindex],
//                         imageData.data[Gindex],
//                         imageData.data[Bindex]
//                     )
//                     // map the value to 0-1 and apply Math.pow for flavor
//                     return Math.pow(color.getGrayScale() / controls.DENSITY, 2.7)
//                 }
//             })
//             const points = pds.fill()
//             const selectedPixesl: Particle[] = []


//             for(let i =0; i < points.length; i++){
//                 const point = points[i]
//                 const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4
//                 const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1
//                 const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2
//                 const Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 3
//                 const pixel = new Pixel(
//                     point[0],
//                     point[1],
//                     imageData.data[Rindex],
//                     imageData.data[Gindex],
//                     imageData.data[Bindex],
//                     imageData.data[Aindex]
//                 )
//                 const particle = new Particle(
//                     controls.SIZE,
//                     pixel,
//                     controls.COLOR,
//                     controls.DOT_COLOR,
//                     ctx,
//                     new Vector2(0,0),
//                     new Vector2(0,0),
//                     controls.MOVE_HORIZENTAL,
//                     controls.MOVE_VERTICAL,
//                 ) 
//                 selectedPixesl.push(particle)
//             }
//             sample = selectedPixesl
//         })
//     }
// }

document.addEventListener('DOMContentLoaded', () => {
    // const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
    // const text = document.querySelector<HTMLDivElement>('#text')
    const uploadBTN = document.querySelector<HTMLInputElement>('#imagePicker')
    // const submitBtn = document.querySelector<HTMLButtonElement>('#submitBtn')
    // const mapBtn = document.querySelector<HTMLButtonElement>('#mapBtn')
    const submitBtn = document.getElementById('submitBtn')
    const mapBtn = document.getElementById('mapBtn')
    
    const app = new App('#app')
    const actions = {
        loadFile : () => {
            if(uploadBTN){
                uploadBTN.click()
            }
        },
        exportJPG: () => {
            app.exportJPG()       
        },
        exportPNG: () => {
            app.exportPNG()
        },
        exportSVG: () => {
            app.exportSVG()
        },

        InsertText: () => {
            if(submitBtn){
                submitBtn.click()
            }
        },

        generateMap: () => {
            if(mapBtn){
                mapBtn.click()
            }
        }
    }
    const stateManager = new StateManager(initialState)
    
    stateManager.subscribe(app.setTextInput, 'TEXT_INPUT')
    stateManager.subscribe(app.setMapScale, 'MAP_SCALE')
    stateManager.subscribe(app.setMapStrength, 'MAP_STRENGTH')
    stateManager.subscribe(app.setParticleRadius, 'SIZE')
    stateManager.subscribe(app.setFontSize, 'FONT_SIZE')
    stateManager.subscribe(app.setCanvasBG, 'BG_COLOR')
    stateManager.subscribe(app.setParticleDensity, 'DENSITY')
    stateManager.subscribe(app.setVerticalDeformity, 'MOVE_VERTICAL')
    stateManager.subscribe(app.setHorizentalDeformity, 'MOVE_HORIZENTAL')
    stateManager.subscribe(app.setDotColorMode, 'COLOR')
    stateManager.subscribe(app.setDotColorMode, 'DOT_COLOR')
    
    const datGUIStateNotifier = new DatGuiStateNotifier(
        stateManager,
        actions
    )


    datGUIStateNotifier.init()

    app.init()

    // const textInput = document.querySelector<HTMLInputElement>('#textInput')

    const reader = new FileReader()
    reader.onload = function (event) {
        const target = event.target 
        if(!target){
            return
        }
        app.goToImageUploadedState(event.target.result as string, stateManager.state)
    }

    if(uploadBTN){
        uploadBTN.onchange = function(e){
            // console.log('uploadBTNpushed')
            e.preventDefault()
            const target = e.target as HTMLInputElement
            if(!target || !target.files) return
            const file = target.files[0]
            if (file) {
                reader.readAsDataURL(file)
            }
        }
    }

    if(submitBtn){
        // console.log('submitBtn')
        submitBtn.onclick = function(e){
            // console.log('submitBtn clicked')

            e.preventDefault()
            if(stateManager.state.TEXT_INPUT){
                // console.log(stateManager.state.TEXT_INPUT)
                
                app.goToTextInsertedState(stateManager.state)
            }
        }
    }

    if(mapBtn){
        mapBtn.onclick = function(e){
            e.preventDefault()
            app.goToMapState(stateManager.state)
        }
    }

})

// document.addEventListener('DOMContentLoaded', () => {

//     const submitBtn = document.querySelector<HTMLButtonElement>('#submitBtn')

//     const app = new App('#app2')

//     const actions = {
//         InsertText: () => {
//             if(submitBtn){
//                 submitBtn.click()
//             }
//         },
//     }

//     const stateManager = new StateManager(initialState)
    
//     stateManager.subscribe(app.setTextInput, 'TEXT_INPUT')

//     const datGUIStateNotifier = new DatGuiStateNotifier(
//         stateManager,
//         actions
//     )

//     datGUIStateNotifier.init()

//     app.init()

//     const textInput = document.querySelector<HTMLInputElement>('#textInput')

//     if(submitBtn){
//         console.log('submitBtn')
//         submitBtn.onclick = function(e){
//             e.preventDefault()
//             if(textInput){
//                 app.goToTextInsertedState(stateManager.state)
//             }
//         }
//     }
// })

