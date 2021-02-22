import { ipcRenderer } from "electron";
import { setBusy } from "../state/app";
import { logErr, logInfo } from "../library/log";
import { AddVaultPayload, DatasourceConfig } from "../types";

export async function addNewVaultTarget(
    datasourceConfig: DatasourceConfig,
    password: string,
    createNew: boolean
) {
    setBusy(true);
    const addNewVaultPromise = new Promise<void>((resolve, reject) => {
        ipcRenderer.once("add-vault-config:reply", (evt, payload) => {
            const { ok, error } = JSON.parse(payload) as { ok: boolean, error?: string };
            if (ok) return resolve();
            reject(new Error(`Failed adding vault: ${error}`));
        });
    });
    const payload: AddVaultPayload = {
        createNew,
        datasourceConfig,
        masterPassword: password
    };
    logInfo(`Adding new vault: ${datasourceConfig.type}`);
    ipcRenderer.send("add-vault-config", JSON.stringify(payload));
    try {
        await addNewVaultPromise;
        setBusy(false);
    } catch (err) {
        logErr(err);
        setBusy(false);
        // @todo show error
    }
}

export async function getFileVaultParameters(): Promise<{ filename: string, createNew: boolean } | null> {
    const getVaultDetailsPromise = new Promise<{ filename: string, createNew: boolean }>(resolve => {
        ipcRenderer.once("get-add-vault-filename:reply", (evt, payload) => {
            resolve(JSON.parse(payload));
        });
    });
    ipcRenderer.send("get-add-vault-filename");
    const {
        filename,
        createNew
    } = await getVaultDetailsPromise;
    return {
        filename,
        createNew
    };
}
