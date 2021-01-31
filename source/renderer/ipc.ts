import { ipcRenderer } from "electron";
import { getCurrentSourceID, setVaultsList } from "./state/vaults";
import { fetchUpdatedFacade } from "./actions/facade";
import { VaultSourceDescription } from "./types";

ipcRenderer.on("source-updated", (evt, sourceID) => {
    const currentSourceID = getCurrentSourceID();
    if (sourceID === currentSourceID) {
        fetchUpdatedFacade(sourceID);
    }
});

ipcRenderer.on("vaults-list", (evt, payload) => {
    // const { message } = response;
    const vaults = JSON.parse(payload) as Array<VaultSourceDescription>;
    setVaultsList(vaults);
});
