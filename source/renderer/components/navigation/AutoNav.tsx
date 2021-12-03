import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState as useHookState } from "@hookstate/core";
import { sortVaults } from "../../library/vault";
import { logInfo } from "../../library/log";
import { CURRENT_VAULT, VAULTS_LIST } from "../../state/vaults";

export function AutoNav() {
    const history = useHistory();
    const currentVaultState = useHookState(CURRENT_VAULT);
    const vaultsState = useHookState(VAULTS_LIST);
    useEffect(() => {
        const currentVault = currentVaultState.get();
        if (currentVault) {
            logInfo(`Auto-nav: Current vault available: ${currentVault}`);
            history.push(`/source/${currentVault}`);
            return;
        }
        const vaults = sortVaults(vaultsState.get());
        if (vaults.length > 0) {
            logInfo(`Auto-nav: First vault in order: ${vaults[0].id}`);
            history.push(`/source/${vaults[0].id}`);
            return;
        }
        logInfo("Auto-nav: No vaults, new-vault page");
        history.push("/add-vault");
    }, [history, currentVaultState, vaultsState]);
    return null;
}
