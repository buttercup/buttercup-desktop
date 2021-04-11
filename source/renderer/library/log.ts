import { ipcRenderer } from "electron";
import { serialiseLogItems } from "../../shared/library/log";
import { LogLevel } from "../types";

export function logErr(...items: Array<any>) {
    ipcRenderer.send(
        "log",
        JSON.stringify({
            level: LogLevel.Error,
            log: serialiseLogItems(["(front-end)", ...items])
        })
    );
}

export function logInfo(...items: Array<any>) {
    ipcRenderer.send(
        "log",
        JSON.stringify({
            level: LogLevel.Info,
            log: serialiseLogItems(["(front-end)", ...items])
        })
    );
}

export function logWarn(...items: Array<any>) {
    ipcRenderer.send(
        "log",
        JSON.stringify({
            level: LogLevel.Warning,
            log: serialiseLogItems(["(front-end)", ...items])
        })
    );
}
