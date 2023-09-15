import { NextFunction, Request, Response } from "express";
import { Layerr, LayerrInfo } from "layerr";
import { ZodError } from "zod";
import statuses from "statuses";
import { logErr, logWarn } from "../../library/log";
import { BrowserAPIErrorType } from "../../types";

export function handleError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ZodError) {
        // Validation error(s)
        logWarn(`API request resulted in validation error: ${JSON.stringify(err.format())}`);
        res.status(400).send("Bad Request");
        return;
    }
    logErr(`API error: ${err.message} ${Layerr.fullStack(err)}`);
    let responseCode = 500,
        errorInfo: LayerrInfo;
    try {
        errorInfo = Layerr.info(err);
    } catch {
        logErr(`Error handler received a non-error object: ${err}`);
        errorInfo = {};
    }
    const { code = null, status = null } = errorInfo;
    switch (code) {
        case BrowserAPIErrorType.AuthMismatch:
            responseCode = 403;
            break;
        case BrowserAPIErrorType.NoAPIKey:
            responseCode = 401;
            break;
        case BrowserAPIErrorType.NoAuthorization:
            responseCode = 401;
            break;
        case BrowserAPIErrorType.VaultInvalidState:
            responseCode = 500;
            break;
    }
    if (status && typeof status === "number") {
        responseCode = status;
    }
    const responseText = statuses(responseCode) as string;
    logWarn(`API request failed: ${req.url}: ${responseCode} ${responseText} (${code})`);
    res.status(responseCode);
    res.set("Content-Type", "text/plain").send(responseText);
}
