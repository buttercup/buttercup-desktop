import { createStateObject } from "obstate";

export const BROWSER_ACCESS = createStateObject<{
    code: string | null;
}>({
    code: null
});

export function setBrowserAccessCode(code: string | null) {
    BROWSER_ACCESS.code = code;
}
