import { ipcRenderer } from "electron";
import { VaultFacade, VaultSourceID } from "buttercup";
import { setCurrentFacade } from "../state/vaults";

export async function fetchUpdatedFacade(sourceID: VaultSourceID) {
    const getVaultFacadePromise = new Promise<VaultFacade>((resolve, reject) => {
        ipcRenderer.once("get-vault-facade:reply", (evt, facade) => {
            resolve(JSON.parse(facade));
        });
    });
    ipcRenderer.send("get-vault-facade", sourceID);
    const facade = await getVaultFacadePromise;
    setCurrentFacade(sourceID, facade);
}
