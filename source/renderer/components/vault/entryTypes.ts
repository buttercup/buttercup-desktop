import { IconName, MaybeElement } from "@blueprintjs/core";
import { EntryType } from "buttercup";

export const defaultType = EntryType.Login;

export const types: Array<{
    type: EntryType;
    icon: IconName | MaybeElement;
    default?: boolean;
}> = [
    {
        type: EntryType.Login,
        icon: "id-number",
        default: true
    },
    {
        type: EntryType.Website,
        icon: "globe-network"
    },
    {
        type: EntryType.CreditCard,
        icon: "credit-card"
    },
    {
        type: EntryType.Note,
        icon: "annotation"
    },
    {
        type: EntryType.SSHKey,
        icon: "key"
    }
];
