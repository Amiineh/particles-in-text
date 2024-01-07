import { COLORS } from '../../types'
import { StateNotifier } from './StateNotifier'
// @ts-ignore
import dat from 'dat.gui'

export class DatGuiStateNotifier extends StateNotifier {
    gui = new dat.GUI()
    init(): void {
        this.gui.add(this.stateManager.state, 'TEXT_INPUT').onChange((text: string) => this.stateManager.set('TEXT_INPUT', text)).name('Text')
        this.gui.add(this.actions, 'InsertText').name('Insert Text')
        this.gui.add(this.stateManager.state, 'FONT_SIZE', 50, 200, 5).onChange( (font_size: number) => this.stateManager.set('FONT_SIZE', font_size)).name('Font Size')
        this.gui.add(this.actions, 'loadFile').name('Upload Your Image')
        this.gui.add(this.stateManager.state, 'COLOR', ['black', 'invert', 'original', 'grayscale', 'custom']).onChange(
            (value: COLORS) => this.stateManager.set('COLOR', value)
        ).name('Dot Color')
        this.gui.add(this.stateManager.state, 'SIZE', 1,25, 1).onChange( (size: number) => this.stateManager.set('SIZE', size)).name('Dot Size')
        this.gui.addColor(this.stateManager.state, 'BG_COLOR').onChange((color: string) => this.stateManager.set('BG_COLOR', color)).name('Background Color')
        this.gui.addColor(this.stateManager.state, 'DOT_COLOR').onChange((color: string) => this.stateManager.set('DOT_COLOR', color)).name('Dots Custom Color')
        this.gui.add(this.stateManager.state, 'DENSITY', 0.5 , 10, 0.2).onChange( (density: number) => this.stateManager.set('DENSITY', density)).name('Density')
        // this.gui.add(this.stateManager.state, 'MIN_DIST', 1.5 , 150, 0.2).onChange( () => this.stateManager.set('MIN_DIST')).name('Density') 
        // this.gui.add(this.stateManager.state, 'INTERACTION').onChange( () => this.stateManager.set('INTERACTION')).name('Interactive') 
        // this.gui.add(this.stateManager.state, 'UNEASY').onChange( () => this.stateManager.set('UNEASY')) .name('Uneaze')
        // this.gui.add(this.stateManager.state, 'UNEAZYRANGE', 1 , 10, 1).onChange( () => this.stateManager.set('UNEAZYRANGE')).name('Un Eeazy range')
        this.gui.add(this.stateManager.state, 'MOVE_HORIZENTAL', 0 , 5000, 1).onChange( (val: number) => this.stateManager.set('MOVE_HORIZENTAL', val)).name('Move Horizental') 
        this.gui.add(this.stateManager.state, 'MOVE_VERTICAL', 0 , 5000, 1).onChange( (val: number) => this.stateManager.set('MOVE_VERTICAL', val)).name('Move Vertical') 
        this.gui.add(this.actions, 'exportJPG').name('Export JPG')
        this.gui.add(this.actions, 'exportPNG').name('Export PNG')
        this.gui.add(this.actions, 'exportSVG').name('Export SVG')
    }
}