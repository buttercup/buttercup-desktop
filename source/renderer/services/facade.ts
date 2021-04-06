import { VaultFacade } from "buttercup";
import EventEmitter from "eventemitter3";

let __currentFacade = null,
    __emitter: EventEmitter = null;

export function getCurrentFacade(): VaultFacade {
    return __currentFacade;
}

export function getFacadeEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}

export function setCurrentFacade(facade: VaultFacade) {
    __currentFacade = facade;
    __emitter.emit("facadeUpdated");
}
