import { generateKeyPair } from "node:crypto";
import { Layerr } from "layerr";
import { getConfigValue, setConfigValue } from "./config";

export async function generateBrowserKeys(): Promise<void> {
    let privateKeyStr = await getConfigValue("browserPrivateKey"),
        publicKeyStr = await getConfigValue("browserPublicKey");
    if (privateKeyStr && publicKeyStr) return;
    const { publicKey, privateKey } = await new Promise<{
        publicKey: string;
        privateKey: string;
    }>((resolve, reject) => {
        generateKeyPair(
            "rsa",
            {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: "spki",
                    format: "pem"
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem"
                }
            },
            (err, publicKey, privateKey) => {
                if (err) {
                    return reject(new Layerr(err, "Failed generating browser key pair"));
                }
                resolve({
                    publicKey,
                    privateKey
                });
            }
        );
    });
    await setConfigValue("browserPrivateKey", privateKey);
    await setConfigValue("browserPublicKey", publicKey);
}

export async function getBrowserPublicKeyString(): Promise<string> {
    const publicKeyStr = await getConfigValue("browserPublicKey");
    if (!publicKeyStr) {
        throw new Error("Public key not found");
    }
    return publicKeyStr;
}
