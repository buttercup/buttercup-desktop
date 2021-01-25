import { VaultSource } from "buttercup";
import { SourceType, VaultSourceDescription } from "../types";

export function describeSource(source: VaultSource): VaultSourceDescription {
    return {
        id: source.id,
        name: source.name,
        state: source.status,
        type: source.type as SourceType
    };
}
