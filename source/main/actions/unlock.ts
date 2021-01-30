import { VaultSourceID } from "buttercup";
import { unlockSource } from "../services/buttercup";

export async function unlockSourceWithID(sourceID: VaultSourceID, password: string) {
    await unlockSource(sourceID, password);
}
