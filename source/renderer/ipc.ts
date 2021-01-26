import { ipcRenderer } from "electron";
import { setVaultsList } from "./state/vaults";
import { VaultSourceDescription } from "./types";

ipcRenderer.on("vaults-list", (evt, payload) => {
    // const { message } = response;
    const vaults = JSON.parse(payload) as Array<VaultSourceDescription>;
    setVaultsList(vaults);
});
