import { createState } from "@hookstate/core";
import { VaultManager } from "buttercup";
import { describeSource } from "../library/sources";
import { VaultSourceDescription } from "../types";

export const VAULTS_LIST = createState<Array<VaultSourceDescription>>([]);

export function attachVaultManagerEvents(vaultMgr: VaultManager) {
    vaultMgr.on("sourcesUpdated", () => {
        VAULTS_LIST.set(vaultMgr.sources.map(source => describeSource(source)));
    });
}
