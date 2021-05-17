import { ipcRenderer } from "electron";
import { createClient } from "@buttercup/googledrive-client";

export async function createEmptyVault(
    accessToken: string,
    parentIdentifier: string,
    filename: string,
    password: string
): Promise<string> {
    const getVaultSourcePromise = new Promise<string>((resolve, reject) => {
        ipcRenderer.once("get-empty-vault:reply", (evt, vaultSrc) => {
            resolve(vaultSrc);
        });
    });
    ipcRenderer.send(
        "get-empty-vault",
        JSON.stringify({
            password
        })
    );
    const vaultSrc = await getVaultSourcePromise;
    const client = createClient(accessToken);
    const fileID = await client.putFileContents({
        contents: vaultSrc,
        id: null,
        name: filename,
        parent: parentIdentifier
    });
    return fileID;
}
