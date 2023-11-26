import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSingleState } from "react-obstate";
import { sortVaults } from "../../library/vault";
import { logInfo } from "../../library/log";
import { VAULTS_STATE } from "../../state/vaults";

export function AutoNav() {
    const history = useHistory();
    const [currentVault, setCurrentVault] = useSingleState(VAULTS_STATE, "currentVault");
    const [vaults] = useSingleState(VAULTS_STATE, "vaultsList");
    useEffect(() => {
        if (currentVault) {
            logInfo(`Auto-nav: Current vault available: ${currentVault}`);
            history.push(`/source/${currentVault}`);
            setCurrentVault(currentVault);
            return;
        }
        const sortedVaults = sortVaults(vaults);
        if (sortedVaults.length > 0) {
            logInfo(`Auto-nav: First vault in order: ${sortedVaults[0].id}`);
            history.push(`/source/${sortedVaults[0].id}`);
            setCurrentVault(sortedVaults[0].id);
            return;
        }
        logInfo("Auto-nav: No vaults, new-vault page");
        history.push("/add-vault");
    }, [history, currentVault, setCurrentVault, vaults]);
    return null;
}
