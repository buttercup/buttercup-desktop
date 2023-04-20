import { ipcRenderer } from "electron";
import { GoogleDriveClient } from "@buttercup/googledrive-client";

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
    const client = new GoogleDriveClient(accessToken);
    const fileID = await client.putFileContents(vaultSrc, null, filename, parentIdentifier);
    return fileID;
}
