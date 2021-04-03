export function extractSSHPubKeyName(pubKey: string): string {
    const parts = pubKey.trim().split(" ");
    return parts[parts.length - 1];
}
