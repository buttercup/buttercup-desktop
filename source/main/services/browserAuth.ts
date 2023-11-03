import { webcrypto } from "node:crypto";
import { EncryptionAlgorithm, createAdapter } from "iocane";
import { getConfigValue, setConfigValue } from "./config";
import { API_KEY_ALGO, API_KEY_CURVE } from "../symbols";

export async function decryptPayload(
    payload: string,
    sourcePublicKey: string,
    targetPrivateKey: string
): Promise<string> {
    const privateKey = await importECDHKey(targetPrivateKey);
    const publicKey = await importECDHKey(sourcePublicKey);
    const secret = await deriveSecretKey(privateKey, publicKey);
    return createAdapter().decrypt(payload, secret) as Promise<string>;
}

export async function deriveSecretKey(
    privateKey: CryptoKey,
    publicKey: CryptoKey
): Promise<string> {
    const cryptoKey = await webcrypto.subtle.deriveKey(
        {
            name: API_KEY_ALGO,
            public: publicKey
        },
        privateKey,
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    const exported = await webcrypto.subtle.exportKey("raw", cryptoKey);
    return Buffer.from(exported).toString("hex");
}

export async function encryptPayload(
    payload: string,
    sourcePrivateKey: string,
    targetPublicKey: string
): Promise<string> {
    const privateKey = await importECDHKey(sourcePrivateKey);
    const publicKey = await importECDHKey(targetPublicKey);
    const secret = await deriveSecretKey(privateKey, publicKey);
    return createAdapter()
        .setAlgorithm(EncryptionAlgorithm.GCM)
        .setDerivationRounds(100000)
        .encrypt(payload, secret) as Promise<string>;
}

async function exportECDHKey(key: CryptoKey): Promise<string> {
    const exported = await webcrypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
}

export async function generateBrowserKeys(): Promise<void> {
    let privateKeyStr = await getConfigValue("browserPrivateKey"),
        publicKeyStr = await getConfigValue("browserPublicKey");
    if (privateKeyStr && publicKeyStr) return;
    const { privateKey, publicKey } = await webcrypto.subtle.generateKey(
        {
            name: API_KEY_ALGO,
            namedCurve: API_KEY_CURVE
        },
        true,
        ["deriveKey"]
    );
    privateKeyStr = await exportECDHKey(privateKey);
    publicKeyStr = await exportECDHKey(publicKey);
    await setConfigValue("browserPrivateKey", privateKeyStr);
    await setConfigValue("browserPublicKey", publicKeyStr);
}

export async function getBrowserPublicKeyString(): Promise<string> {
    const publicKeyStr = await getConfigValue("browserPublicKey");
    if (!publicKeyStr) {
        throw new Error("Public key not found");
    }
    return publicKeyStr;
}

async function importECDHKey(key: string): Promise<CryptoKey> {
    const jwk = JSON.parse(key) as JsonWebKey;
    const usages: Array<KeyUsage> =
        jwk.key_ops && jwk.key_ops.includes("deriveKey") ? ["deriveKey"] : [];
    return webcrypto.subtle.importKey(
        "jwk",
        jwk,
        {
            name: API_KEY_ALGO,
            namedCurve: API_KEY_CURVE
        },
        true,
        usages
    );
}
