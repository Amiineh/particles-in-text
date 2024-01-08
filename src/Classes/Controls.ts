import { COLORS } from '../types'
// @ts-ignore
import dat from 'dat.gui'
import { App } from './App'
// @ts-ignore
import * as PoissonDiskSampling from 'poisson-disk-sampling'
import { Color } from './Color'
import { Particle } from './Shapes/Particle'
import { Pixel } from './Pixel'
import { Vector2 } from './Vector2'

type notifyFN<T> = (state: T) => void

type Subscribers<T extends object> = {
  [key in keyof T]: Array<notifyFN<T>>
}

export class State {
    public subscribableStates = {
        TEXT_INPUT: 'Jaav',
        MIN_DIST: 1.9,
        DENSITY: 200,
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
    public FnStates ={
        loadFile : function() { 
            const button = document.getElementById('imagePicker')
            if(button){
                button.click()
            }
        },
        insertText : function() {
            const button = document.getElementById('submitBtn')
            if(button){
                button.click()
            }
        },
        generateMap : function() {
            const button = document.getElementById('mapBtn')
            if(button){
                button.click()
            }
        },
        exportToJPG : (_app: App) => {
            if(!this.img){
                alert('No Image!')
                return
            }
            const dpi = prompt('Enter DPI?')
            const width = prompt('Enter Print Width(CM)?')
            const height = prompt('Enter Print height(CM)?')
            if(dpi && width && height){
                const PaperWidth = parseInt(width)  * parseInt(dpi) / 2.54 
                const paperHeight = parseInt(height) * parseInt(dpi) /2.54

                const exportCanvas = document.createElement('canvas')
                exportCanvas.width = PaperWidth
                exportCanvas.height = paperHeight
                const ctx = exportCanvas.getContext('2d')
                if(!ctx) return

                ctx.drawImage(
                    this.img, 
                    0,
                    0, 
                    this.img.width, 
                    this.img.height,
                    0,
                    0,
                    exportCanvas.width,
                    exportCanvas.height
                )

                const imgeData =  ctx.getImageData(0, 0, exportCanvas.width, exportCanvas.height)

                const pds = new PoissonDiskSampling({
                    shape: [imgeData.width, imgeData.height],
                    minDistance: this.subscribableStates.MIN_DIST,
                    maxDistance: 55,
                    tries: 10,
                    distanceFunction: (point: any) => {
                        // get the index of the red pixel value for the given coordinates (point)
                        const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4
                        const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4) + 1
                        const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4) + 2
                        const Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4) + 3
                        const color = new Color(
                            imgeData.data[Rindex],
                            imgeData.data[Gindex],
                            imgeData.data[Bindex], 
                            imgeData.data[Aindex]
                        )
                        // map the value to 0-1 and apply Math.pow for flavor
                        return Math.pow(color.getGrayScale() / this.subscribableStates.DENSITY, 2.7)
                    }
                })
                const points = pds.fill()
                const selectedPixesl: Particle[] = []
    
    
                for(let i =0; i < points.length; i++){
                    const point = points[i]
                    const Rindex = (Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4
                    const Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4) + 1
                    const Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4) + 2
                    const Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imgeData.width) * 4) + 3
                    const pixel = new Pixel(
                        point[0],
                        point[1],
                        new Color(
                        imgeData.data[Rindex],
                        imgeData.data[Gindex],
                        imgeData.data[Bindex],
                        imgeData.data[Aindex])
                    )
                    const particle = new Particle(
                        this.subscribableStates.SIZE,
                        pixel,
                        this.subscribableStates.COLOR,
                        this.subscribableStates.DOT_COLOR,
                        ctx,
                        new Vector2(0,0),
                        new Vector2(0,0),
                        this.subscribableStates.MOVE_HORIZENTAL,
                        this.subscribableStates.MOVE_VERTICAL,
                    ) 
                    selectedPixesl.push(particle)
                }
        

                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
                ctx.fillStyle = this.subscribableStates.BG_COLOR
                ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
                if(selectedPixesl.length > 0){
                    for(let i = 0; i < selectedPixesl.length; i++){
                        selectedPixesl[i].draw(0, {mouseX: 0, mouseY:0}, false, false)
                    }
                }
                const link = document.createElement('a')
                link.download = 'download'
                const url = exportCanvas.toDataURL('image/png')
                link.href = url
                link.click()
            }

        },
    }
    gui = new dat.GUI()
    private subscribers:Subscribers<State['subscribableStates']>  = Object.keys(this.subscribableStates).reduce((acc, key) => ({...acc, [key]: []}), {}) as Subscribers<State['subscribableStates']>
    private img: HTMLImageElement | null = null
    constructor(){
        this.gui.add(this.subscribableStates, 'TEXT_INPUT').onChange(() => this.notify('TEXT_INPUT')).name('Text Input');
        this.gui.add(this.FnStates, 'InsertText').name('Insert Text')
        this.gui.add(this.subscribableStates, 'FONT_SIZE', 50, 200, 5).onChange(() => this.notify('FONT_SIZE')).name('Font Size')
        this.gui.add(this.FnStates, 'generateMap').name('Generate Map')
        this.gui.add(this.subscribableStates, 'MAP_SCALE', 0.001, 0.01, 0.0001).onChange(() => this.notify('MAP_SCALE')).name('Map Scale')
        this.gui.add(this.subscribableStates, 'MAP_STRENGTH', 0, 1, 0.1).onChange(() => this.notify('MAP_STRENGTH')).name('Map Strength')
        this.gui.add(this.FnStates, 'loadFile').name('Upload Your Image')
        this.gui.add(this.subscribableStates, 'COLOR', ['black', 'invert', 'original', 'grayscale', 'custom']).onChange(() => this.notify('COLOR')).name('Dot Color')
        this.gui.addColor(this.subscribableStates, 'BG_COLOR').onChange(() => this.notify('BG_COLOR')).name('Background Color')
        this.gui.addColor(this.subscribableStates, 'DOT_COLOR').onChange(() => this.notify('DOT_COLOR')).name('Dots Custom Color')
        this.gui.add(this.subscribableStates, 'SIZE', 1,25, 0.1).onChange( () => this.notify('SIZE')).name('Dot Size')
        // this.gui.add(this.subscribableStates, "DENSITY", 180 , 300, 20).onChange( () => this.notify()).name("Density")
        this.gui.add(this.subscribableStates, 'MIN_DIST', 0.5 , 10, 0.2).onChange( () => this.notify('MIN_DIST')).name('Density') 
        this.gui.add(this.subscribableStates, 'INTERACTION').onChange( () => this.notify('INTERACTION')).name('Interactive') 
        this.gui.add(this.subscribableStates, 'UNEASY').onChange( () => this.notify('UNEASY')) .name('Uneaze')
        this.gui.add(this.subscribableStates, 'UNEAZYRANGE', 1 , 10, 1).onChange( () => this.notify('UNEAZYRANGE')).name('Un Eeazy range')
        this.gui.add(this.subscribableStates, 'MOVE_HORIZENTAL', 0 , 5000, 1).onChange( () => this.notify('MOVE_HORIZENTAL')).name('Move Horizental') 
        this.gui.add(this.subscribableStates, 'MOVE_VERTICAL', 0 , 5000, 1).onChange( () => this.notify('MOVE_VERTICAL')).name('Move Vertical') 
        this.gui.add(this.FnStates, 'exportToJPG').name('Export to JPG')

        
  
    }
    

    subscribe(
        FN: (state: typeof this.subscribableStates) => void,
        states: Array<keyof State['subscribableStates']> = Object.keys(this.subscribableStates) as Array<keyof State['subscribableStates']>
    ){
        for(let i =0; i < states.length; i++){
            this.subscribers[states[i]].push(FN)
        }
    }
    notify(key: keyof State['subscribableStates']){
        const functions = this.subscribers[key]
        for(let j = 0; j < functions.length; j++){
            functions[j](this.subscribableStates)
        }
    }


    setIMG(img: HTMLImageElement){
        this.img = img
    }
}