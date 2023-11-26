import { ipcRenderer } from "electron";
import { VaultFacade, VaultSourceID } from "buttercup";
import { VAULTS_STATE } from "../state/vaults";
import { setCurrentFacade } from "../services/facade";

export async function fetchUpdatedFacade(sourceID: VaultSourceID) {
    const { attachments, facade: rawFacade } = await ipcRenderer.invoke(
        "get-vault-facade",
        sourceID
    );
    const facade: VaultFacade = JSON.parse(rawFacade);
    VAULTS_STATE.currentVaultAttachments = !!attachments;
    VAULTS_STATE.currentVault = sourceID;
    if (!facade) {
        setCurrentFacade(null);
        return;
    }
    setCurrentFacade(facade);
}
