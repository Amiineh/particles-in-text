import { Particle } from '../../Shapes/Particle'
import { ColorState } from './index'

export class OriginalColorState extends ColorState {
    getColor(particle: Particle){
        return particle.pixel.color.getRGB()
    }
}

export class InvertColorState extends ColorState {
    getColor(particle: Particle){
        return particle.pixel.color.getInvert()
    }
}

export class BlackColorState extends ColorState {
    getColor(_: Particle){
        return '#000000'
    }
}

export class GrayScaleColorState extends ColorState {
    getColor(particle: Particle){
        const grayScale =  particle.pixel.color.getGrayScale()
        return `rgb(${grayScale}, ${grayScale}, ${grayScale})`
    }
}

export class CustomColorState extends ColorState {
    constructor(private color: string){
        super()
    }

    getColor(_: Particle){
        return this.color
    }
}