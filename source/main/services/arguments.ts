import { app } from "electron";

let __autostarted = false,
    __showMainWindow = true;

export function processCLFlags() {
    const cl = app.commandLine;
    // Deprecated switch
    if (cl.hasSwitch("no-window")) {
        __showMainWindow = false;
    }
    if (cl.hasSwitch("hidden")) {
        __showMainWindow = false;
    }
    if (cl.hasSwitch("autostart")) {
        __autostarted = true;
    }
}

export function shouldShowMainWindow(): boolean {
    return __showMainWindow;
}

export function wasAutostarted(): boolean {
    return __autostarted;
}
