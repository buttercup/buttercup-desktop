import nestedProperty from "nested-property";
import { ExecutionContext } from "styled-components";

export function getThemeProp(props: unknown, propName: string): string {
    const res = nestedProperty.get(props, `theme.vault.${propName}`);
    if (res === null) {
        console.warn(`No theme value found for \`${propName}\`.`);
        return "red";
    }
    return res;
}
