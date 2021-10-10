import BiometricProvider from "./BiometricProvider";
import { VaultSourceID } from "buttercup";
import {
    CredentialStore,
    Passport,
    PassportModule,
    PassportError,
    PassportErrorCode
} from "node-ms-passport";
import { APP_ID } from "../../../shared/symbols";
import { logInfo, logWarn } from "../../library/log";
import { Layerr } from "layerr";
import crypto from "crypto";
import { updateAppMenu } from "../../actions/appMenu";

/**
 * A windows biometric provider.
 * Will create a passport account for buttercup.
 * This creates some random bytes, uses windows hello
 * to sign those bytes, then, hashes the signature
 * using two different hash algorithms to create a
 * key and iv to be used with an aes encryption instance.
 * The aes instance is then used to encrypt the
 * password. After that, the password is stored in
 * the windows credential vault. The random bytes are
 * stored as the user name encoded as a base64 string.
 * The account id consists of the app id and the vault id.
 *
 * The key retrieval process is just the store process
 * in reverse except that the random bytes stored in
 * the user name are used to create the key and iv.
 *
 * When the password is removed from the credential
 * vault, the program checks if buttercup has still
 * other vault passwords stored in the credential vault.
 * If there are no stored passwords left, the
 * passport account will be removed.
 */
export default class WindowsBiometricProvider implements BiometricProvider {
    /**
     * The type of cipher used to encrypt the password
     * @private
     */
    private static readonly CIPHER: string = "aes-256-cbc";

    /**
     * The encoding for any buffers which contain raw bytes
     * @private
     */
    private static readonly BYTE_ENCODING: BufferEncoding = "base64";

    /**
     * The encoding to encode and decode strings
     * @private
     */
    private static readonly STRING_ENCODING: BufferEncoding = "utf16le";

    /**
     * The hash algorithm used to create the aes key
     * @private
     */
    private static readonly KEY_HASH_TYPE: string = "sha256";

    /**
     * The hash algorithm used to create the aes initialization vector
     * @private
     */
    private static readonly IV_HASH_TYPE: string = "md5";

    /**
     * The number of random bytes to generate to sign
     * using passport to create the key and iv from
     * @private
     */
    private static readonly CHALLENGE_LENGTH: number = 128;

    /**
     * Create a windows biometric provider instance.
     * Will check if the module is packaged in an
     * .asar file and if it is, replaces the 'app.asar'
     * part with 'app.asar.unpacked' to fix a bug which
     * causes electron to not load unpacked modules.
     */
    public constructor() {
        PassportModule.electronAsarFix();
    }

    /**
     * Disable the biometric unlock for a vault.
     * Removes the password from the password
     * vault. Also, checks if buttercup has
     * passwords left in the password vault and
     * if not, this will remove the microsoft
     * passport account for buttercup.
     *
     * @param sourceID the vault id
     */
    public async disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void> {
        try {
            // Remove the account
            const store = new CredentialStore(`${APP_ID}/${sourceID}`, false);
            await store.remove();

            const accounts = await CredentialStore.enumerateAccounts(`${APP_ID}/*`);
            if (accounts.length === 0) {
                // We do not own any more accounts,
                // remove the passport account
                const hello = new Passport(APP_ID);
                await hello.deletePassportAccount();
            }
        } catch (err) {
            logWarn("Could not delete the password from the credential vault", err);
            throw new Layerr(
                {
                    cause: err,
                    info: {
                        i18n: "notification.error.biometrics-disable-failed"
                    }
                },
                `Failed to delete the password from the credential vault for source: ${sourceID}`
            );
        }

        await updateAppMenu();
    }

    /**
     * Get the vault password via biometrics.
     * For this, the password is retrieved from
     * the credential vault, the bytes to sign
     * are retrieved from the user name field,
     * decoded from base64 and hashed to create the
     * key and iv. Then, the aes instance is created
     * and the password is decrypted and returned.
     *
     * @param sourceID the id of the vault to get the password for
     * @returns the retrieved password
     */
    public async getSourcePasswordViaBiometrics(sourceID: VaultSourceID): Promise<string> {
        try {
            // Read the data from the credential store
            const store = new CredentialStore(`${APP_ID}/${sourceID}`, false);
            const cred = await store.read();

            // Get the challenge from the username and get the key and iv
            const challenge = Buffer.from(cred.username, WindowsBiometricProvider.BYTE_ENCODING);
            const { key, iv } = await WindowsBiometricProvider.getKeys(challenge);

            // Must load the password into the memory
            await cred.loadPassword();

            // Create an aes instance and decrypt the password
            const aes = crypto.createDecipheriv(WindowsBiometricProvider.CIPHER, key, iv);
            const password = Buffer.concat([
                aes.update(Buffer.from(cred.password, WindowsBiometricProvider.BYTE_ENCODING)),
                aes.final()
            ]);

            // Clean up
            aes.destroy();
            WindowsBiometricProvider.zeroBuffers(challenge, key, iv);

            // Return the password as a string
            return password.toString(WindowsBiometricProvider.STRING_ENCODING);
        } catch (err) {
            if (
                err instanceof PassportError &&
                err.getCode() == PassportErrorCode.ERR_USER_CANCELLED
            ) {
                logInfo(`Windows hello unlock cancelled by user for source: ${sourceID}`);
                return null;
            }

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

    /**
     * Check if a vault supports biometric unlock.
     * Enumerates all vaults with a filter mask
     * and checks if any vault matches the mask.
     *
     * @param sourceID the id of the vault to check for
     * @returns true if biometric unlock is enabled for the given vault
     */
    public async sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean> {
        try {
            const accounts = await CredentialStore.enumerateAccounts(`${APP_ID}/${sourceID}`);
            return accounts.length > 0;
        } catch (e) {
            logWarn("CredentialStore.enumerateAccounts failed", e);
            return false;
        }
    }

    /**
     * Store a password using windows hello.
     * Will create a microsoft passport account
     * for buttercup if it doesn't already exist.
     * Creates random bytes which will then be signed
     * by the (newly) created passport account and
     * hashed to create an aes key and iv from.
     * After that the password is encrypted using
     * the aes instance and stored in base64 in the
     * credential vault. The random bytes are stored
     * in base64 as the user name, the app id and
     * the vault id are combined to create the
     * credential vault account id.
     *
     * @param sourceID the id of the vault to store the password of
     * @param password the password to store
     */
    public async storePassword(sourceID: VaultSourceID, password: string): Promise<void> {
        try {
            // Generate a random challenge
            const challenge: Buffer = crypto.randomBytes(WindowsBiometricProvider.CHALLENGE_LENGTH);
            const { key, iv } = await WindowsBiometricProvider.getKeys(challenge, true);

            // Create the cipher and encrypt the password
            const aes = crypto.createCipheriv(WindowsBiometricProvider.CIPHER, key, iv);
            const data = Buffer.concat([
                aes.update(Buffer.from(password, WindowsBiometricProvider.STRING_ENCODING)),
                aes.final()
            ]);

            // Convert the encrypted password to a string
            const encrypted: string = data.toString(WindowsBiometricProvider.BYTE_ENCODING);

            // Store the challenge and password
            const credentialStore = new CredentialStore(`${APP_ID}/${sourceID}`, false);
            await credentialStore.write(
                challenge.toString(WindowsBiometricProvider.BYTE_ENCODING),
                encrypted
            );

            // Clean up
            aes.destroy();
            WindowsBiometricProvider.zeroBuffers(key, iv, challenge);
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

    /**
     * Check if this supports biometric unlock.
     * Only returns false if the os version is not
     * greater or equal to windows 10 or
     * windows hello isn't available for some reason.
     * Like the user is connected via rdp or is using
     * a local user rather than a microsoft account
     *
     * @returns true if this system supports biometric unlock
     */
    public async supportsBiometricUnlock(): Promise<boolean> {
        return PassportModule.available() && Passport.passportAvailable();
    }

    /**
     * Get the aes key and iv from the challenge bytes.
     * Signs the bytes, hashes the result and returns the
     * aes key and iv. Will create a passport account
     * if initial is set to true and the account doesn't
     * already exist.
     *
     * @param challenge the challenge to sign
     * @param initial whether this is allowed to create the passport account
     * @return the aes key and iv combo
     * @private
     */
    private static async getKeys(challenge: Buffer, initial: boolean = false): Promise<AesKeyIv> {
        const passport = new Passport(APP_ID);
        if (initial && !passport.accountExists) {
            await passport.createPassportKey();
        }

        const signature: Buffer = await passport.passportSign(challenge);

        const key = crypto
            .createHash(WindowsBiometricProvider.KEY_HASH_TYPE)
            .update(signature)
            .digest();
        const iv = crypto
            .createHash(WindowsBiometricProvider.IV_HASH_TYPE)
            .update(signature)
            .digest();

        WindowsBiometricProvider.zeroBuffers(signature);
        return {
            key: key,
            iv: iv
        };
    }

    /**
     * Zero out a list of buffers
     *
     * @param buf the buffers to zero out
     * @private
     */
    private static zeroBuffers(...buf: Buffer[]): void {
        buf.forEach((b) => b.fill(0));
    }
}

/**
 * An aes key and iv combo
 */
interface AesKeyIv {
    // The aes key buffer. Should be 256 bytes long.
    key: Buffer;
    // The aes iv buffer. Should be 128 bytes long.
    iv: Buffer;
}
