import { VaultSourceID } from "buttercup";
import { removeSource } from "../services/buttercup";
import { logInfo } from "../library/log";

export async function removeSourceWithID(sourceID: VaultSourceID) {
    await removeSource(sourceID);
    logInfo(`Removed source: ${sourceID}`);
}
