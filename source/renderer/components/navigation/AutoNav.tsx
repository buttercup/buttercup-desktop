import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState as useHookState } from "@hookstate/core";
import { sortVaults } from "../../library/vault";
import { CURRENT_VAULT, VAULTS_LIST } from "../../state/vaults";

export function AutoNav() {
    const history = useHistory();
    const currentVaultState = useHookState(CURRENT_VAULT);
    const vaultsState = useHookState(VAULTS_LIST);
    useEffect(() => {
        const currentVault = currentVaultState.get();
        if (currentVault) {
            history.push(`/source/${currentVault}`);
            return;
        }
        const vaults = sortVaults(vaultsState.get());
        if (vaults.length > 0) {
            history.push(`/source/${vaults[0].id}`);
        }
    }, [history, currentVaultState, vaultsState]);
    return null;
}
