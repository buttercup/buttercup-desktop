import { Layerr } from "layerr";
import { decryptPayload, encryptPayload, getBrowserPublicKeyString } from "../browserAuth";
import { getConfigValue, setConfigValue } from "../config";
import { BrowserAPIErrorType } from "../../types";

export async function decryptAPIPayload(clientID: string, payload: string): Promise<string> {
    // Check that the client is registered, we don't actually
    // use their key for decryption..
    const clients = await getConfigValue("browserClients");
    const clientConfig = clients[clientID];
    if (!clientConfig) {
        throw new Layerr(
            {
                info: {
                    clientID,
                    code: BrowserAPIErrorType.NoAPIKey
                }
            },
            "No client key registered for decryption"
        );
    }
    // Private key for decryption
    const browserPrivateKey = await getConfigValue("browserPrivateKey");
    // Decrypt
    return decryptPayload(payload, clientConfig.publicKey, browserPrivateKey);
}

export async function encryptAPIPayload(clientID: string, payload: string): Promise<string> {
    // Check that the client is registered, we don't actually
    // use their key for decryption..
    const clients = await getConfigValue("browserClients");
    const clientConfig = clients[clientID];
    if (!clientConfig) {
        throw new Layerr(
            {
                info: {
                    clientID,
                    code: BrowserAPIErrorType.NoAPIKey
                }
            },
            "No client key registered for encryption"
        );
    }
    // Private key for decryption
    const browserPrivateKey = await getConfigValue("browserPrivateKey");
    // Encrypt
    return encryptPayload(payload, browserPrivateKey, clientConfig.publicKey);
}

export async function registerPublicKey(id: string, publicKey: string): Promise<string> {
    const clients = await getConfigValue("browserClients");
    await setConfigValue("browserClients", {
        ...clients,
        [id]: {
            publicKey
        }
    });
    const serverPublicKey = await getBrowserPublicKeyString();
    return serverPublicKey;
}
