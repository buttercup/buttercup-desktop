import { VaultFormatID, VaultSourceID } from "buttercup";
import { logInfo } from "../library/log";
import { convertVaultFormatAToB, getVaultFormat } from "./buttercup";

export async function convertVaultFormat(
    sourceID: VaultSourceID,
    format: VaultFormatID
): Promise<boolean> {
    const currentFormat = getVaultFormat(sourceID);
    logInfo(`attempt convert vault format: ${sourceID} (${currentFormat} => ${format})`);
    if (!currentFormat) return false;
    if (currentFormat === VaultFormatID.A && format === VaultFormatID.B) {
        await convertVaultFormatAToB(sourceID);
        return true;
    }
    return false;
}
