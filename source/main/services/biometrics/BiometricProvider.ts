import { VaultSourceID } from "buttercup";
import { isOSX, isWindows } from "../../../shared/library/platform";
import MacOsBiometricProvider from "./MacOsBiometricProvider";
import WindowsBiometricProvider from "./WindowsBiometricProvider";
import DummyBiometricProvider from "./DummyBiometricProvider";

/**
 * A biometric provider
 */
export default abstract class BiometricProvider {
    /**
     * The static biometric provider instance.
     * Gets set on each system individually
     * once getInstance() is called.
     * @private
     */
    private static instance: BiometricProvider = null;

    /**
     * Get the correct biometrics provider for this
     * type of operating system. Returns a static
     * biometric provider instance and creates it
     * if it is still set to null.
     *
     * @returns the static biometric provider instance
     */
    public static getInstance(): BiometricProvider {
        if (BiometricProvider.instance == null) {
            if (isOSX()) {
                BiometricProvider.instance = new MacOsBiometricProvider();
            } else if (isWindows()) {
                BiometricProvider.instance = new WindowsBiometricProvider();
            } else {
                BiometricProvider.instance = new DummyBiometricProvider();
            }
        }

        return BiometricProvider.instance;
    }

    public abstract disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void>;

    public abstract getSourcePasswordViaBiometrics(sourceID: VaultSourceID): Promise<string>;

    public abstract sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean>;

    public abstract supportsBiometricUnlock(): Promise<boolean>;

    public abstract storePassword(sourceID: VaultSourceID, password: string): Promise<void>;
}
