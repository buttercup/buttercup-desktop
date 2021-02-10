import { VaultSourceID } from "buttercup";
import { removeSource } from "../services/buttercup";

export async function removeSourceWithID(sourceID: VaultSourceID) {
    await removeSource(sourceID);
}
