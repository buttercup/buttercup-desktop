import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { getCurrentSourceID, setCurrentVault, setVaultsList } from "../state/vaults";

export async function removeVaultSource(sourceID: VaultSourceID) {
    console.log("REMOVE!", sourceID, getCurrentSourceID());
    if (sourceID === getCurrentSourceID()) {
        console.log("SET CURRENT TO NULL");
        setCurrentVault(null);
    }
    // setVaultsList(getVaultsList().filter(vault => vault.id !== sourceID));
    ipcRenderer.send(
        "remove-source",
        JSON.stringify({
            sourceID
        })
    );
}
