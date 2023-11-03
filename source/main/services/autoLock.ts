import { Preferences } from "../../shared/types";
import { logInfo } from "../library/log";
import { getUnlockedSourcesCount, lockAllSources } from "./buttercup";
import { getConfigValue } from "./config";

let __autoVaultLockTimeout: NodeJS.Timeout | null = null,
    __autoLockEnabled = false;

export async function setAutoLockEnabled(value: boolean) {
    __autoLockEnabled = value;
}

export async function startAutoVaultLockTimer() {
    stopAutoVaultLockTimer();
    if (!__autoLockEnabled) return;
    const { lockVaultsAfterTime } = await getConfigValue("preferences");
    if (!lockVaultsAfterTime) return;
    __autoVaultLockTimeout = setTimeout(() => {
        if (getUnlockedSourcesCount() === 0) return;
        logInfo("Timer elapsed. Auto lock all vaults");
        lockAllSources();
    }, lockVaultsAfterTime * 1000);
}

export function stopAutoVaultLockTimer() {
    if (__autoVaultLockTimeout) {
        clearTimeout(__autoVaultLockTimeout);
    }
}
