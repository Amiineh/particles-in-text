export type StateRecord = Record<string, number | string | boolean>
export type CallbackFunction<T extends StateRecord> = (val: T) => void

export interface IStateManager<T extends StateRecord> {
    state: T
    subscribtions: {
      [K in keyof T]: Array<CallbackFunction<T>>
    }
    set<K extends keyof T>(k: K, val: T[K] ):void
    subscribe<K extends keyof T>(cb: CallbackFunction<T>, ...keys: Array<K>): void
}

export class StateManager<T extends StateRecord>{
    subscribtions: {
      [K in keyof T]: Array<CallbackFunction<T>>
    }
    constructor(public state: T){
        const subs:{
          [K in keyof T]: Array<CallbackFunction<T>>
        } = {} as {
          [K in keyof T]: Array<CallbackFunction<T>>
        }

        const stateKeys: Array<keyof T> = Object.keys(state)  

        for(let i = 0; i < stateKeys.length; i++){
            subs[stateKeys[i]] = []
        }

        this.subscribtions = subs
    }

    set<K extends keyof T>(k: K, val: T[K] ){
        this.state[k] = val
        for(const subscribtion of this.subscribtions[k]){
            subscribtion(this.state)
        }
    }

    subscribe<K extends keyof T>(cb: CallbackFunction<T>, ...keys: Array<K>){
        for(const key of keys){
            this.subscribtions[key].push(cb)
        }
    }
}

