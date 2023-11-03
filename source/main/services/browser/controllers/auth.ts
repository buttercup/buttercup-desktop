import { Request, Response } from "express";
import { Layerr } from "layerr";
import { logInfo } from "../../../library/log";
import { registerPublicKey } from "../auth";
import { promptUserForBrowserAccess, validateEnteredCode } from "../interaction";
import { AuthRequestSchema, AuthResponseSchema } from "../models";
import { BrowserAPIErrorType } from "../../../types";

export async function handleAuthPing(req: Request, res: Response) {
    res.send("OK");
}

export async function processAuthRequest(req: Request, res: Response) {
    logInfo(`Browser access authorisation request received: ${req.get("origin")}`);
    AuthRequestSchema.parse(req.body);
    await promptUserForBrowserAccess();
    res.send("OK");
}

export async function processAuthResponse(req: Request, res: Response) {
    const { code, id, publicKey } = AuthResponseSchema.parse(req.body);
    const isValid = await validateEnteredCode(code);
    if (!isValid) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.AuthMismatch
                }
            },
            "Incorrect code entered"
        );
    }
    // Register client key
    const serverKey = await registerPublicKey(id, publicKey);
    logInfo("Connected new browser key");
    res.json({
        publicKey: serverKey
    });
}
