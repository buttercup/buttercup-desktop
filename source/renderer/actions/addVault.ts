import { ipcRenderer } from "electron";
import { getPrimaryPassword } from "./password";
import { SourceType } from "../types";

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
    ipcRenderer.send("add-existing-vault", JSON.stringify({
        existing: true,
        type: SourceType.File,
        filename,
        masterPassword: password
    }));
}
