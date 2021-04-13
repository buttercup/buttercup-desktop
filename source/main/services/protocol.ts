import { BrowserWindow } from "electron";
import EventEmitter from "eventemitter3";
import { logErr, logInfo, logWarn } from "../library/log";
import { BUTTERCUP_PROTOCOL } from "../symbols";

let __protocolEmitter: EventEmitter = null;

export function getProtocolEmitter(): EventEmitter {
    if (!__protocolEmitter) {
        __protocolEmitter = new EventEmitter();
    }
    return __protocolEmitter;
}

function handleAuthCall(args) {
    if (!Array.isArray(args) || args.length === 0) {
        logErr("Empty auth call: aborting");
        return;
    }
    const [action, ...actionArgs] = args;
    switch (action) {
        case "google":
            getProtocolEmitter().emit("authGoogle", actionArgs);
            BrowserWindow.getAllWindows().forEach((win) => {
                win.webContents.send("protocol:auth/google", actionArgs);
            });
            break;
        default:
            logWarn("Unable to handle authentication protocol execution");
            break;
    }
}

export function handleProtocolCall(protocolURL: string) {
    const path = protocolURL.replace(BUTTERCUP_PROTOCOL, "");
    logInfo(`Protocol URL call: ${path}`);
    const [action, ...args] = path.split("/");
    switch (action) {
        case "auth":
            handleAuthCall(args);
            break;
        default:
            logWarn(`Failed handling protocol URL: ${protocolURL}`);
            break;
    }
}
