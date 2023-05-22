import { Request, Response } from "express";
import { getSourceStatus } from "../../buttercup";
import { VaultUnlockParamSchema } from "../models";
import { openMainWindow } from "../../windows";

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
