import { VaultSourceID } from "buttercup";
import createPerfTimer from "execution-time";
import { unlockSource } from "../services/buttercup";
import { logInfo } from "../library/log";

export async function unlockSourceWithID(sourceID: VaultSourceID, password: string) {
    const timer = createPerfTimer();
    timer.start();
    await unlockSource(sourceID, password);
    const results = timer.stop();
    logInfo(`Unlocked source: ${sourceID} (took: ${results.time} ms)`);
}
