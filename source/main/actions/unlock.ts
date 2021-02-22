import { VaultSourceID } from "buttercup";
import { unlockSource } from "../services/buttercup";
import { logInfo } from "../library/log";

export async function unlockSourceWithID(sourceID: VaultSourceID, password: string) {
    await unlockSource(sourceID, password);
    logInfo(`Unlocked source: ${sourceID}`);
}
