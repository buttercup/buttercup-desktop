import { State, createState } from "@hookstate/core";

export const FILE_HOST_CODE: State<string> = createState<string>(null);

export function setFileHostCode(code: string | null) {
    FILE_HOST_CODE.set(code);
}
