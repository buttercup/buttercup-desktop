import { IncomingMessage, Server, ServerResponse } from "node:http";
import { Application } from "express";
import { BROWSER_API_HOST_PORT } from "../../symbols";
import { buildApplication } from "./api";

let __app: Application | null = null,
    __server: Server<typeof IncomingMessage, typeof ServerResponse>;

export async function start(): Promise<void> {
    if (__app) return;
    __app = buildApplication();
    return new Promise<void>((resolve) => {
        __server = __app.listen(BROWSER_API_HOST_PORT, resolve);
    });
}

export async function stop() {}
