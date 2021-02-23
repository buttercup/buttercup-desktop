import { ipcRenderer } from "electron";
import { getCurrentSourceID, setVaultsList } from "./state/vaults";
import { showAddVaultMenu } from "./state/addVault";
import { fetchUpdatedFacade } from "./actions/facade";
import { unlockVaultSource } from "./actions/unlockVault";
import { VaultSourceDescription } from "./types";

ipcRenderer.on("add-vault", evt => {
    showAddVaultMenu(true);
});

ipcRenderer.on("source-updated", (evt, sourceID) => {
    const currentSourceID = getCurrentSourceID();
    if (sourceID === currentSourceID) {
        fetchUpdatedFacade(sourceID);
    }
});

ipcRenderer.on("unlock-vault", async (evt, sourceID) => {
    await unlockVaultSource(sourceID);
});

ipcRenderer.on("vaults-list", (evt, payload) => {
    const vaults = JSON.parse(payload) as Array<VaultSourceDescription>;
    setVaultsList(vaults);
});
