import { Request, Response } from "express";
import { Layerr } from "layerr";
import { logInfo } from "../../../library/log";
import { BrowserAPIErrorType } from "../../../types";
import { getConfigValue, setConfigValue } from "../../config";
import { generateTokens } from "../auth";
import { promptUserForBrowserAccess, validateEnteredCode } from "../interaction";
import { AuthRequestSchema, AuthResponseSchema } from "../models";

export async function processAuthRequest(req: Request, res: Response) {
    logInfo(`Browser access authorisation request received: ${req.get("origin")}`);
    AuthRequestSchema.parse(req.body);
    await promptUserForBrowserAccess();
    res.send("OK");
}

export async function processAuthResponse(req: Request, res: Response) {
    const { code } = AuthResponseSchema.parse(req.body);
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
    // Generate new token
    const { token, verifier } = await generateTokens();
    const existingTokens = await getConfigValue("browserAPIKeys");
    await setConfigValue("browserAPIKeys", [...new Set([...existingTokens, verifier])]);
    logInfo("Generated new browser access token");
    res.json({
        token
    });
}
