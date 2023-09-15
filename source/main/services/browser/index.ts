import { IncomingMessage, Server, ServerResponse } from "node:http";
import { Application } from "express";
import { BROWSER_API_HOST_PORT } from "../../symbols";
import { buildApplication } from "./api";
import { logInfo } from "../../library/log";
import { getConfigValue } from "../config";

let __app: Application | null = null,
    __server: Server<typeof IncomingMessage, typeof ServerResponse>;

export async function start(): Promise<void> {
    if (__app) return;
    const apiClients = await getConfigValue("browserClients");
    logInfo(`Starting browser API (${Object.keys(apiClients).length} keys registered)`);
    __app = buildApplication();
    return new Promise<void>((resolve) => {
        __server = __app.listen(BROWSER_API_HOST_PORT, resolve);
    });
}

export async function stop() {
    if (!__server) return;
    return new Promise<void>((resolve, reject) => {
        __server.close((err) => {
            if (err) {
                return reject(err);
            }
            __server = null;
            __app = null;
            resolve();
        });
    });
}
