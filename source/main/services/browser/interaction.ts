import type { BrowserWindow } from "electron";
import { Layerr } from "layerr";
import { getMainWindow, openMainWindow } from "../windows";

const CODE_LENGTH = 8;

let __code: string | null = null;

export async function clearCode(): Promise<void> {
    __code = null;
    const window = getMainWindow();
    if (window) {
        window.webContents.send("browser-access-code-hide");
    }
}

function generateCode(length: number): string {
    let code = "";
    while (code.length < length) {
        code = `${code}${Math.floor(Math.random() * 10)}`;
    }
    return code;
}

export async function promptUserForBrowserAccess() {
    clearCode();
    let window: BrowserWindow;
    try {
        window = await openMainWindow();
    } catch (err) {
        throw new Layerr(err, "Failed opening window");
    }
    __code = generateCode(CODE_LENGTH);
    window.webContents.send("browser-access-code", JSON.stringify({ code: __code }));
}

export async function validateEnteredCode(browserCode: string): Promise<boolean> {
    const valid = __code !== null && __code === browserCode;
    await clearCode();
    return valid;
}
