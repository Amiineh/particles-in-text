import { ColorState } from './index';
export class OriginalColorState extends ColorState {
    getColor(particle) {
        return particle.pixel.color.getRGB();
    }
}
export class InvertColorState extends ColorState {
    getColor(particle) {
        return particle.pixel.color.getInvert();
    }
}
export class BlackColorState extends ColorState {
    getColor(_) {
        return '#000000';
    }
}
export class GrayScaleColorState extends ColorState {
    getColor(particle) {
        const grayScale = particle.pixel.color.getGrayScale();
        return `rgb(${grayScale}, ${grayScale}, ${grayScale})`;
    }
}
export class CustomColorState extends ColorState {
    constructor(color) {
        super();
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: color
        });
    }
    getColor(_) {
        return this.color;
    }
}
