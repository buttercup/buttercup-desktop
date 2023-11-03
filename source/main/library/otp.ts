import { Entry, EntryPropertyValueType, EntryURLType, getEntryURLs, VaultSource } from "buttercup";
import { OTP } from "../types";

export function extractVaultOTPItems(source: VaultSource): Array<OTP> {
    return source.vault.getAllEntries().reduce((output: Array<OTP>, entry: Entry) => {
        const properties = entry.getProperties();
        const loginURLs = getEntryURLs(properties, EntryURLType.Login);
        for (const key in properties) {
            if (entry.getPropertyValueType(key) !== EntryPropertyValueType.OTP) continue;
            output.push({
                sourceID: source.id,
                entryID: entry.id,
                entryProperty: key,
                entryTitle: properties.title,
                loginURL: loginURLs.length > 0 ? loginURLs[0] : null,
                otpURL: properties[key]
            });
        }
        return output;
    }, []);
}
