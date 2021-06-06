import { ipcRenderer } from "electron";
import { VaultFacade, VaultSourceID } from "buttercup";
import { setCurrentVault, setCurrentVaultSupportsAttachments } from "../state/vaults";
import { setCurrentFacade } from "../services/facade";

export async function fetchUpdatedFacade(sourceID: VaultSourceID) {
    const { attachments, facade } = await ipcRenderer.invoke("get-vault-facade", sourceID);
    setCurrentVaultSupportsAttachments(attachments);
    setCurrentVault(sourceID);
    if (!facade) {
        setCurrentFacade(null);
        return;
    }
    setCurrentFacade(facade);
}
