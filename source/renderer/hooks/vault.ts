import { VaultSourceID } from "buttercup";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { VaultSourceDescription } from "../types";
import { logErr } from "../library/log";
import { showError } from "../services/notifications";

export function useSourceDetails(sourceID: VaultSourceID): VaultSourceDescription {
    const [details, setDetails] = useState<VaultSourceDescription>(null);
    useEffect(() => {
        let mounted = true;
        ipcRenderer
            .invoke("get-vault-description", sourceID)
            .then((desc: VaultSourceDescription) => {
                if (!mounted) return;
                setDetails(desc);
            })
            .catch((err) => {
                logErr(err);
                showError(`Failed fetching vault details: ${err.message}`);
            });
        return () => {
            mounted = false;
        };
    }, [sourceID]);
    return details;
}
