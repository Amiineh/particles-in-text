export class StateNotifier {
    constructor(stateManager, actions) {
        Object.defineProperty(this, "stateManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: stateManager
        });
        Object.defineProperty(this, "actions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: actions
        });
    }
}
