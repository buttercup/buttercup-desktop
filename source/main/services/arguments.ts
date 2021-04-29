import { app } from "electron";

let __showMainWindow = true;

export function processCLFlags() {
    const cl = app.commandLine;
    if (cl.hasSwitch("no-window")) {
        __showMainWindow = false;
    }
}

export function shouldShowMainWindow(): boolean {
    return __showMainWindow;
}
