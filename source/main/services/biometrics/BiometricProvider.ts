import { VaultSourceID } from "buttercup";
import { isOSX, isWindows } from "../../../shared/library/platform";
import MacOsBiometricProvider from "./MacOsBiometricProvider";
import WindowsBiometricProvider from "./WindowsBiometricProvider";
import DummyBiometricProvider from "./DummyBiometricProvider";

export interface BiometricProvider {
    disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void>;

    getSourcePasswordViaBiometrics(sourceID: VaultSourceID): Promise<string>;

    sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean>;

    supportsBiometricUnlock(): Promise<boolean>;

    storePassword(sourceID: VaultSourceID, password: string): Promise<void>;
}

let provider: BiometricProvider = null;

export function getBiometricProvider(): BiometricProvider {
    if (provider == null) {
        if (isOSX()) {
            provider = new MacOsBiometricProvider();
        } else if (isWindows()) {
            provider = new WindowsBiometricProvider();
        } else {
            provider = new DummyBiometricProvider();
        }
    }

    return provider;
}
