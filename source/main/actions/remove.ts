import { VaultSourceID } from "buttercup";
import { lockSource, removeSource } from "../services/buttercup";
import { logInfo } from "../library/log";

export async function removeSourceWithID(sourceID: VaultSourceID) {
    await lockSource(sourceID);
    await removeSource(sourceID);
    logInfo(`Removed source: ${sourceID}`);
}
