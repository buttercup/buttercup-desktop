import { Preferences } from "../../shared/types";
import { logInfo } from "../library/log";
import { lockAllSources } from "./buttercup";
import { getConfigValue } from "./config";

let autoVaultLockTimeout: NodeJS.Timeout | null = null;
let autoUpdate = false;

export async function startAutoVaultLockTimer() {
    if (!autoUpdate) {
        return;
    }
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

export async function setAutoUpdate(value: boolean) {
    autoUpdate = value;
}
