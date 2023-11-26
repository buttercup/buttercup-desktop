import { VaultFacade } from "buttercup";
import EventEmitter from "eventemitter3";

let __currentFacade: VaultFacade | null = null,
    __emitter: EventEmitter | null = null;

export function getCurrentFacade(): VaultFacade | null {
    return __currentFacade;
}

export function getFacadeEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}

export function setCurrentFacade(facade: VaultFacade | null) {
    __currentFacade = facade;
    getFacadeEmitter().emit("facadeUpdated");
}
