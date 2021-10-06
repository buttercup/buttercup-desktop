import { BiometricProvider } from "./BiometricProvider";
import { VaultSourceID } from "buttercup";
import { CredentialStore, Passport } from "node-ms-passport";
import { APP_ID } from "../../../shared/symbols";
import { logWarn } from "../../library/log";
import { Layerr } from "layerr";
import crypto from "crypto";
import { updateAppMenu } from "../../actions/appMenu";

export default class WindowsBiometricProvider implements BiometricProvider {
    public async disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void> {
        //const hello = new Passport(APP_ID);
        //await hello.deletePassportAccount();
        const store = new CredentialStore(`${APP_ID}/${sourceID}`, true);
        await store.remove();
        await updateAppMenu()
    }

    public async getSourcePasswordViaBiometrics(sourceID: VaultSourceID): Promise<string> {
        try {
            const hello = new Passport(APP_ID);

            await WindowsBiometricProvider.helloCheck(hello);
            const store = new CredentialStore(`${APP_ID}/${sourceID}`);
            const cred = await store.read();

            await cred.loadPassword();
            return cred.password;
        } catch (err) {
            logWarn("Windows hello failed", err);
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
            const store = new CredentialStore(`${APP_ID}/${sourceID}`);
            const cred = await store.read();

            return cred.username == sourceID;
        } catch (e) {
            logWarn("CredentialStore.getPassword failed", e);
        }
    }

    public async storePassword(sourceID: VaultSourceID, password: string): Promise<void> {
        try {
            const hello = new Passport(APP_ID);

            if (!hello.accountExists) {
                await hello.createPassportKey();
            }

            await WindowsBiometricProvider.helloCheck(hello);

            const credentialStore = new CredentialStore(`${APP_ID}/${sourceID}`, true);
            await credentialStore.write(sourceID, password);
        } catch (err) {
            logWarn("Windows hello failed", err);
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
    }

    public async supportsBiometricUnlock(): Promise<boolean> {
        return Passport.passportAvailable();
    }

    private static async helloCheck(hello: Passport): Promise<void> {
        const challenge = crypto.randomBytes(32);
        const signature = await hello.passportSign(challenge);

        if (!await Passport.verifySignature(challenge, signature, await hello.getPublicKey())) {
            throw new Error("Could not verify the signature");
        }
    }
}
