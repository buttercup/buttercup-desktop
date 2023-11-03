import { Response } from "express";
import { Layerr } from "layerr";
import { BrowserAPIErrorType } from "../../types";
import { encryptAPIPayload } from "./auth";

export async function respondJSON(res: Response, obj: Record<string, any>) {
    const { clientID } = res.locals as { clientID: string };
    if (!clientID) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.NoAPIKey
                }
            },
            "No client ID set: Invalid response state"
        );
    }
    const data = await encryptAPIPayload(clientID, JSON.stringify(obj));
    res.set("X-Bcup-API", "enc,1");
    res.set("Content-Type", "text/plain");
    res.set("X-Content-Type", "application/json");
    res.send(data);
}

export async function respondText(res: Response, text: string) {
    const { clientID } = res.locals as { clientID: string };
    if (!clientID) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.NoAPIKey
                }
            },
            "No client ID set: Invalid response state"
        );
    }
    const data = await encryptAPIPayload(clientID, text);
    res.set("X-Bcup-API", "enc,1");
    res.set("Content-Type", "text/plain");
    res.send(data);
}
