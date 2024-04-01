import { VaultSourceID } from "buttercup";
import { useCallback, useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { logErr } from "../library/log";
import { showError } from "../services/notifications";
import { VaultSourceDescription } from "../types";

export function useSourceDetails(
    sourceID: VaultSourceID | null
): [VaultSourceDescription | null, () => void] {
    const [details, setDetails] = useState<VaultSourceDescription | null>(null);
    const updateDescription = useCallback(() => {
        if (sourceID === null) {
            setDetails(null);
            return;
        }
        ipcRenderer
            .invoke("get-vault-description", sourceID)
            .then((desc: VaultSourceDescription) => {
                setDetails(desc);
            })
            .catch((err) => {
                logErr(err);
                showError(`Failed fetching vault details: ${err.message}`);
            });
    }, [sourceID]);
    useEffect(() => {
        if (!sourceID) {
            setDetails(null);
            return;
        }
        updateDescription();
    }, [sourceID]);
    return [details, updateDescription];
}
