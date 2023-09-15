import { Request, Response, NextFunction } from "express";
import { Layerr } from "layerr";
import { decryptPayload } from "./auth";
import { BrowserAPIErrorType } from "../../types";
import { getConfigValue } from "../config";

export async function requireClient(req: Request, res: Response, next: NextFunction) {
    const auth = req.get("Authorization");
    const [, clientID] = `${auth}`.split(/\s+/);
    const clients = await getConfigValue("browserClients");
    if (!clients[clientID]) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.NoAPIKey
                }
            },
            "No key registered"
        );
    }
    res.locals.clientID = clientID;
    next();
}

export async function requireKeyAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.get("Authorization");
    const bodyType = req.get("X-Content-Type") ?? "text/plain";
    const [, clientID] = `${auth}`.split(/\s+/);
    // Check client registration
    if (!clientID) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.NoAuthorization
                }
            },
            "No client key provided"
        );
    }
    // Decrypt body
    const decryptedStr = await decryptPayload(clientID, req.body);
    if (/^application\/json/.test(bodyType)) {
        req.headers["content-type"] = bodyType;
        req.body = JSON.parse(decryptedStr);
    } else {
        req.body = decryptedStr;
    }
    next();
}
