import { Request, Response, NextFunction } from "express";
import { Layerr } from "layerr";
import { getConfigValue } from "../config";
import { BrowserAPIErrorType } from "../../types";
import { verifyToken } from "./auth";

export async function requireBrowserToken(req: Request, res: Response, next: NextFunction) {
    const apiKeys = await getConfigValue("browserAPIKeys");
    if (apiKeys.length <= 0) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.NoAPIKey
                }
            },
            "No API key(s) registered"
        );
    }
    let auth = req.get("Authorization");
    if (Array.isArray(auth)) {
        auth = auth[0];
    }
    const [, token] = `${auth}`.split(/\s+/);
    if (!token) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.NoAuthorization
                }
            },
            "No auth token received"
        );
    } else if (!verifyToken(apiKeys, token)) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.AuthMismatch
                }
            },
            "Auth token mismatch"
        );
    }
    next();
}
