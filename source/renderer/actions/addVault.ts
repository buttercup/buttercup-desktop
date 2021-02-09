import { ipcRenderer } from "electron";
import { getPrimaryPassword } from "./password";
import { setBusy } from "../state/app";
import { AddVaultPayload, DatasourceConfig, SourceType } from "../types";

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
        existing: createNew,
        datasourceConfig,
        masterPassword: password
    };
    ipcRenderer.send("add-vault-config", JSON.stringify(payload));
    try {
        await addNewVaultPromise;
        setBusy(false);
    } catch (err) {
        console.error(err);
        setBusy(false);
        // @todo show error
    }
}

export async function startAddFileVault() {
    const getVaultFilenamePromise = new Promise<string>((resolve, reject) => {
        ipcRenderer.once("get-add-vault-filename:reply", (evt, filename) => {
            resolve(JSON.parse(filename));
        });
    });
    ipcRenderer.send("get-add-vault-filename");
    const filename: string = await getVaultFilenamePromise;
    if (!filename) return;
    const password = await getPrimaryPassword();
    if (!password) return;
    return addNewVaultTarget({
        path: filename,
        type: SourceType.File
    }, password, true);
}
