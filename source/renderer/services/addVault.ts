import EventEmitter from "eventemitter3";

let __createNewFileEmitter: EventEmitter = null,
    __vaultAdditionEmitter: EventEmitter = null;

export function getCreateNewFilePromptEmitter(): EventEmitter {
    if (!__createNewFileEmitter) {
        __createNewFileEmitter = new EventEmitter();
    }
    return __createNewFileEmitter;
}

export function getVaultAdditionEmitter(): EventEmitter {
    if (!__vaultAdditionEmitter) {
        __vaultAdditionEmitter = new EventEmitter();
    }
    return __vaultAdditionEmitter;
}
