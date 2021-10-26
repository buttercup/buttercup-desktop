import { Preferences } from "../../shared/types";
import { logInfo } from "../library/log";
import { lockAllSources } from "./buttercup";
import { getConfigValue } from "./config";

let __autoVaultLockTimeout: NodeJS.Timeout | null = null,
    __autoLockEnabled = false;

export async function setAutoLockEnabled(value: boolean) {
    __autoLockEnabled = value;
}

export async function startAutoVaultLockTimer() {
    if (!__autoLockEnabled) return;
    const { lockVaultsAfterTime } = await getConfigValue<Preferences>("preferences");
    stopAutoVaultLockTimer();
    if (!lockVaultsAfterTime) return;
    __autoVaultLockTimeout = setTimeout(() => {
        logInfo("Timer elapsed. Auto lock all vaults");
        lockAllSources();
    }, lockVaultsAfterTime * 1000);
}

export function stopAutoVaultLockTimer() {
    if (__autoVaultLockTimeout) {
        clearTimeout(__autoVaultLockTimeout);
    }
}
