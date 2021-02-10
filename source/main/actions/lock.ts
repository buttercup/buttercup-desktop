import { VaultSourceID } from "buttercup";
import { lockSource } from "../services/buttercup";

export async function lockSourceWithID(sourceID: VaultSourceID) {
    await lockSource(sourceID);
}
