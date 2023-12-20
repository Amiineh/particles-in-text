import { ColorBGDrawer, IAppState } from './types';
export class InitialState extends IAppState {
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
        return;
    }
    setParticleRadius(_) {
        return;
    }
}
