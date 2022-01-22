import { State, createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";

export const GOOGLE_REAUTH_SOURCE: State<VaultSourceID> = createState(null as VaultSourceID);

export function setGoogleReAuthSource(sourceID: VaultSourceID) {
    GOOGLE_REAUTH_SOURCE.set(sourceID);
}
