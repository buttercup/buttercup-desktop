import { VaultSourceID } from "buttercup";
import { updateAppMenu } from "../actions/appMenu";
import { logErr } from "../library/log";

let __lastSourceID: VaultSourceID = null;

export function getLastSourceID(): VaultSourceID {
    return __lastSourceID;
}

export function setLastSourceID(sourceID: VaultSourceID) {
    __lastSourceID = sourceID;
    updateAppMenu().catch((err) => {
        logErr("Failed updating app menu after source change", err);
    });
}
