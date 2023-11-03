import { clipboard } from "electron";
import { Preferences } from "../../shared/types";
import { logInfo } from "../library/log";
import { getConfigValue } from "./config";

let autoClipboardClearTimeout: NodeJS.Timeout | null = null;
let lastCopiedText = "";

export async function restartAutoClearClipboardTimer(text: string) {
    lastCopiedText = text;
    const { autoClearClipboard } = await getConfigValue("preferences");
    if (!autoClearClipboard) {
        return;
    }
    if (autoClipboardClearTimeout) {
        clearTimeout(autoClipboardClearTimeout);
    }
    autoClipboardClearTimeout = setTimeout(() => {
        if (clipboard.readText() === lastCopiedText) {
            logInfo("Timer elapsed. Auto clear clipboard");
            clipboard.clear();
        }
    }, autoClearClipboard * 1000);
}
