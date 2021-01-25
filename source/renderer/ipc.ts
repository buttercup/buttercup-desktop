import { ipcRenderer } from "electron";
import { setVaultsList } from "./state/vaults";
import { VaultSourceDescription } from "./types";

ipcRenderer.on("vaults-list", (evt, response) => {
    const { message } = response;
    const vaults = JSON.parse(message) as Array<VaultSourceDescription>;
    setVaultsList(vaults);
});
