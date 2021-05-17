import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { setBusy } from "../state/app";
import { logErr, logInfo } from "../library/log";
import { getCreateNewFilePromptEmitter, getVaultAdditionEmitter } from "../services/addVault";
import { showNewFilePrompt } from "../state/addVault";
import { AddVaultPayload, DatasourceConfig } from "../types";

type NewVaultChoice = "new" | "existing" | null;

export async function addNewVaultTarget(
    datasourceConfig: DatasourceConfig,
    password: string,
    createNew: boolean,
    fileNameOverride: string = null
) {
    setBusy(true);
    const addNewVaultPromise = new Promise<VaultSourceID>((resolve, reject) => {
        ipcRenderer.once("add-vault-config:reply", (evt, payload) => {
            const { ok, error, sourceID } = JSON.parse(payload) as {
                ok: boolean;
                error?: string;
                sourceID?: VaultSourceID;
            };
            if (ok) return resolve(sourceID);
            reject(new Error(`Failed adding vault: ${error}`));
        });
    });
    const payload: AddVaultPayload = {
        createNew,
        datasourceConfig,
        masterPassword: password,
        fileNameOverride
    };
    logInfo(`Adding new vault: ${datasourceConfig.type}`);
    ipcRenderer.send("add-vault-config", JSON.stringify(payload));
    try {
        const sourceID = await addNewVaultPromise;
        setBusy(false);
        getVaultAdditionEmitter().emit("vault-added", sourceID);
    } catch (err) {
        logErr(err);
        setBusy(false);
        // @todo show error
    }
}

export async function getFileVaultParameters(): Promise<{
    filename: string;
    createNew: boolean;
} | null> {
    showNewFilePrompt(true);
    const emitter = getCreateNewFilePromptEmitter();
    const choice: NewVaultChoice = await new Promise<NewVaultChoice>((resolve) => {
        const callback = (choice: NewVaultChoice) => {
            resolve(choice);
            emitter.removeListener("choice", callback);
        };
        emitter.once("choice", callback);
    });
    showNewFilePrompt(false);
    if (!choice) return null;
    if (choice === "new") {
        const filename = await ipcRenderer.invoke("get-new-vault-filename");
        if (!filename) return null;
        return {
            filename,
            createNew: true
        };
    } else {
        const filename = await ipcRenderer.invoke("get-existing-vault-filename");
        if (!filename) return null;
        return {
            filename,
            createNew: false
        };
    }
}
