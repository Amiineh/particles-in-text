import { Particle } from '../../Shapes/Particle'

export abstract class ColorState {
  abstract getColor(particle: Particle): string
}