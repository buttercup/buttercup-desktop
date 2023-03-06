import { Layerr } from "layerr";
import { createHash, randomInt } from "node:crypto";

const TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-~._";
const TOKEN_LENGTH = 64;

async function generateRandomIntArray(
    length: number,
    min: number,
    max: number
): Promise<Array<number>> {
    const work: Array<Promise<number>> = [];
    for (let i = 0; i < length; i += 1) {
        work.push(
            new Promise((resolve) => {
                randomInt(min, max, (err, val) => {
                    if (err) {
                        throw new Layerr(err, "Failed generating random token for browser access");
                    }
                    resolve(val);
                });
            })
        );
    }
    return Promise.all(work);
}

export async function generateTokens(): Promise<{ token: string; verifier: string }> {
    const indexes = await generateRandomIntArray(TOKEN_LENGTH, 0, TOKEN_CHARS.length);
    let token: string = "";
    for (const ind of indexes) {
        token = `${token}${TOKEN_CHARS[ind]}`;
    }
    return {
        token,
        verifier: hashValueSHA512(token)
    };
}

function hashValueSHA512(value: string): string {
    const hash = createHash("sha512");
    hash.update(value);
    return hash.digest().toString("hex");
}

export function verifyToken(currentKeys: Array<string>, token: string): boolean {
    const hash = hashValueSHA512(token);
    return currentKeys.includes(hash);
}
