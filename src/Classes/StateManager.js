export class StateManager {
    constructor(state) {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: state
        });
        Object.defineProperty(this, "subscribtions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const subs = {};
        const stateKeys = Object.keys(state);
        for (let i = 0; i < stateKeys.length; i++) {
            subs[stateKeys[i]] = [];
        }
        this.subscribtions = subs;
    }
    set(k, val) {
        this.state[k] = val;
        for (const subscribtion of this.subscribtions[k]) {
            subscribtion(this.state);
        }
    }
    subscribe(cb, ...keys) {
        for (const key of keys) {
            this.subscribtions[key].push(cb);
        }
    }
}
