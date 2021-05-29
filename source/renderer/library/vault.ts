import { VaultSourceDescription } from "../types";

export function sortVaults(vaults: Array<VaultSourceDescription>): Array<VaultSourceDescription> {
    return [...vaults].sort((a, b) => {
        if (a.order > b.order) {
            return 1;
        } else if (b.order > a.order) {
            return -1;
        }
        return 0;
    });
}
