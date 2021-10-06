import { BiometricProvider } from "./BiometricProvider";
import { VaultSourceID } from "buttercup";
import { logInfo, logWarn } from "../../library/log";
import { APP_ID } from "../../../shared/symbols";
import keytar from "keytar";
import { systemPreferences } from "electron";
import { t } from "../../../shared/i18n/trans";
import { Layerr } from "layerr";
import { getSourceDescription } from "../buttercup";
import { updateAppMenu } from "../../actions/appMenu";

export default class MacOsBiometricProvider implements BiometricProvider {
    public async disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void> {
        logInfo(`Removing keychain source password (${sourceID}) for app: ${APP_ID}`);
        const deleted = await keytar.deletePassword(APP_ID, sourceID);
        if (!deleted) {
            logWarn(
                `System reported that it did not successfully delete biometric registration for source: ${sourceID}`
            );
        }
        await updateAppMenu()
    }

    public async getSourcePasswordViaBiometrics(sourceID: VaultSourceID): Promise<string> {
        const { name } = getSourceDescription(sourceID);
        try {
            await systemPreferences.promptTouchID(t("biometrics.prompt.unlock-vault", { name }));
            return keytar.getPassword(APP_ID, sourceID);
        } catch (err) {
            if (/Canceled by user/i.test(err.message)) {
                logInfo(`Touch unlock cancelled by user for source: ${sourceID}`);
                return null;
            }
            logWarn("Touch ID failed", err);
            throw new Layerr(
                {
                    cause: err,
                    info: {
                        i18n: "error.biometric-unlock-failed"
                    }
                },
                `Validating biometric details failed for unlocking source: ${sourceID}`
            );
        }
    }

    public async sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean> {
        try {
            const password = await keytar.getPassword(APP_ID, sourceID);
            return !!password;
        } catch (e) {
            logWarn("keytar.getPassword failed", e);
        }
    }

    public async storePassword(sourceID: VaultSourceID, password: string): Promise<void> {
        const { name } = getSourceDescription(sourceID);
        try {
            await systemPreferences.promptTouchID(t("biometrics.prompt.store", { name }));
        } catch (err) {
            logWarn("Touch ID failed", err);
            throw new Layerr(
                {
                    cause: err,
                    info: {
                        i18n: "error.biometric-store-failed"
                    }
                },
                `Storing biometric details failed for source: ${sourceID}`
            );
        }
        logInfo(`Setting keychain source password (${sourceID}) for app: ${APP_ID}`);
        await keytar.setPassword(APP_ID, sourceID, password);
    }

    public async supportsBiometricUnlock(): Promise<boolean> {
        return systemPreferences.canPromptTouchID();
    }
}
