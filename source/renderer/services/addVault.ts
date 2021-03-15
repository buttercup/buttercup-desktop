import EventEmitter from "eventemitter3";

let __emitter: EventEmitter = null;

export function getCreateNewFilePromptEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}
