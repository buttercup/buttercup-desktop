import { createHash } from "node:crypto";
import { ulid } from "ulidx";

export function generateTokens(): { token: string; verifier: string } {
    const token = ulid().toLowerCase();
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
