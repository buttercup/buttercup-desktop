import { Preferences } from "../../shared/types";
import { logInfo } from "../library/log";
import { lockAllSources } from "./buttercup";
import { getConfigValue } from "./config";

let autoVaultLockTimeout: NodeJS.Timeout | null = null;

export async function startAutoVaultLockTimer() {
    const { lockVaultsAfterTime } = await getConfigValue<Preferences>("preferences");
    stopAutoVaultLockTimer();
    if (!lockVaultsAfterTime) {
        return;
    }
    autoVaultLockTimeout = setTimeout(() => {
        logInfo("Timer elapsed. Auto lock all vaults");
        lockAllSources();
    }, lockVaultsAfterTime * 1000);
}

export function stopAutoVaultLockTimer() {
    if (autoVaultLockTimeout) {
        clearTimeout(autoVaultLockTimeout);
    }
}
