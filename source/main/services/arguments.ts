import { app } from "electron";

let __showMainWindow = true;

export function processCLFlags() {
    const cl = app.commandLine;
    // Deprecated switch
    if (cl.hasSwitch("no-window")) {
        __showMainWindow = false;
    }
    if (cl.hasSwitch("hidden")) {
        __showMainWindow = false;
    }
}

export function shouldShowMainWindow(): boolean {
    return __showMainWindow;
}
