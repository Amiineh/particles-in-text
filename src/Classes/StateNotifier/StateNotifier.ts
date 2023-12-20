import type { AppState } from '../../main'
import type { IStateManager } from '../StateManager'

type stateActions =  {
    loadFile: () => void
    exportJPG: () => void
    exportPNG: () => void
    exportSVG: () => void
}

export abstract class StateNotifier {
    constructor(
        protected stateManager: IStateManager<AppState>,
        protected actions: stateActions
    ) {}
    abstract init():void
}