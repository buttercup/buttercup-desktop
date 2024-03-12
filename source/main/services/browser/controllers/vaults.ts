import { Request, Response } from "express";
import { VaultFacade, VaultSourceStatus } from "buttercup";
import { Layerr } from "layerr";
import {
    getSourceDescription,
    getSourceDescriptions,
    getSourceStatus,
    getUnlockedSourceIDs,
    getVaultFacadeBySource,
    lockSource
} from "../../buttercup";
import { VaultUnlockParamSchema } from "../models";
import { openMainWindow } from "../../windows";
import { respondJSON, respondText } from "../response";
import { logErr, logInfo } from "../../../library/log";
import { BrowserAPIErrorType } from "../../../types";

export async function getVaults(req: Request, res: Response) {
    const sources = getSourceDescriptions();
    await respondJSON(res, {
        sources
    });
}

export async function getVaultsTree(req: Request, res: Response) {
    const sourceIDs = getUnlockedSourceIDs();
    const tree = sourceIDs.reduce(
        (output: Record<string, VaultFacade>, sourceID) => ({
            ...output,
            [sourceID]: getVaultFacadeBySource(sourceID)
        }),
        {}
    );
    const names = sourceIDs.reduce(
        (output: Record<string, string>, sourceID) => ({
            ...output,
            [sourceID]: getSourceDescription(sourceID)?.name ?? "Untitled vault"
        }),
        {}
    );
    await respondJSON(res, {
        names,
        tree
    });
}

export async function promptVaultLock(req: Request, res: Response) {
    const { id: sourceID } = VaultUnlockParamSchema.parse(req.params);
    const sourceStatus = getSourceStatus(sourceID);
    logInfo(`(api) prompt vault lock: ${sourceID}`);
    if (!sourceStatus) {
        logErr(`(api) no source exists for locking: ${sourceID}`);
        res.status(404).send("Not Found");
        return;
    }
    if (sourceStatus === VaultSourceStatus.Pending) {
        throw new Layerr(
            {
                info: {
                    code: BrowserAPIErrorType.VaultInvalidState
                }
            },
            "Vault in pending state"
        );
    } else if (sourceStatus === VaultSourceStatus.Locked) {
        res.status(202).send("Accepted");
        return;
    }
    await lockSource(sourceID);
    res.status(200);
    await respondText(res, "OK");
}

export async function promptVaultUnlock(req: Request, res: Response) {
    const { id: sourceID } = VaultUnlockParamSchema.parse(req.params);
    const sourceStatus = getSourceStatus(sourceID);
    logInfo(`(api) prompt vault unlock: ${sourceID}`);
    if (!sourceStatus) {
        logErr(`(api) no source exists for unlocking: ${sourceID}`);
        res.status(404).send("Not Found");
        return;
    }
    const window = await openMainWindow();
    window.webContents.send("unlock-vault-open", sourceID);
    window.focus();
    res.status(200);
    await respondText(res, "OK");
}
