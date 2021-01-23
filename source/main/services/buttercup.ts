import {
    Credentials,
    VaultSource,
    VaultManager
} from "buttercup";

let __vaultManager: VaultManager;

function getVaultManager(): VaultManager {
    if (!__vaultManager) {
        __vaultManager = new VaultManager();
    }
    return __vaultManager;
}
