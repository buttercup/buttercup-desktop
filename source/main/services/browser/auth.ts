import { constants as CryptoConstants, privateDecrypt, publicEncrypt } from "node:crypto";
import { Layerr } from "layerr";
import { getBrowserPublicKeyString } from "../browserAuth";
import { getConfigValue, setConfigValue } from "../config";
import { BrowserAPIErrorType } from "../../types";
import { base64ToBytes, bytesToBase64 } from "buttercup";

export async function decryptPayload(clientID: string, payload: string): Promise<string> {
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
    // Key private key for decryption
    const browserPrivateKey = await getConfigValue("browserPrivateKey");
    console.log("PAYLOAD", payload);
    // console.log("DEC", base64ToBytes(payload));
    // Decrypt
    const decryptedData = privateDecrypt(
        {
            key: browserPrivateKey,
            padding: CryptoConstants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        base64ToBytes(payload)
    );
    return decryptedData.toString("utf-8");
}

export async function encryptPayload(clientID: string, payload: string): Promise<string> {
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
    // Encrypt
    const encryptedData = publicEncrypt(
        {
            key: clientConfig.publicKey,
            padding: CryptoConstants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        Buffer.from(payload, "utf-8")
    );
    return bytesToBase64(encryptedData);
    // return encryptedData.toString("utf-8");
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
