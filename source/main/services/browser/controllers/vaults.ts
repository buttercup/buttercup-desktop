import { Request, Response } from "express";
import { VaultSourceStatus } from "buttercup";
import { Layerr } from "layerr";
import { getSourceDescriptions, getSourceStatus, lockSource } from "../../buttercup";
import { VaultUnlockParamSchema } from "../models";
import { openMainWindow } from "../../windows";
import { BrowserAPIErrorType } from "../../../types";

export async function getVaults(req: Request, res: Response) {
    const sources = getSourceDescriptions();
    res.json({
        sources
    });
}

export async function promptVaultLock(req: Request, res: Response) {
    const { id: sourceID } = VaultUnlockParamSchema.parse(req.params);
    const sourceStatus = getSourceStatus(sourceID);
    if (!sourceStatus) {
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
    res.status(200).send("OK");
}

export async function promptVaultUnlock(req: Request, res: Response) {
    const { id: sourceID } = VaultUnlockParamSchema.parse(req.params);
    const sourceStatus = getSourceStatus(sourceID);
    if (!sourceStatus) {
        res.status(404).send("Not Found");
        return;
    }
    const window = await openMainWindow();
    window.webContents.send("unlock-vault-open", sourceID);
    window.focus();
    res.status(200).send("OK");
}
