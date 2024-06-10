import { pathOr } from "ramda";

export function getThemeProp(props, propName) {
    const res = pathOr(null, ["theme", "vault", ...propName.split("vault-ui..")], props);
    if (res === null) {
        console.warn(`No theme value found for \`${propName}\`.`);
        return "red";
    }
    return res;
}
