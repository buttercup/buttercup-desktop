import { startFileHost as startSecureFileHost } from "@buttercup/secure-file-host";
import { logErr, logInfo } from "../library/log";
import { getConfigValue, setConfigValue } from "./config";
import { getMainWindow, openMainWindow } from "./windows";
import { SECURE_FILE_HOST_PORT } from "../symbols";

let __host = null;

export async function startFileHost() {
    if (__host) return;
    const fileHostKey = await getConfigValue("fileHostKey");
    logInfo(`Starting file host (key exists: ${!!fileHostKey})`);
    __host = fileHostKey
        ? startSecureFileHost(SECURE_FILE_HOST_PORT, fileHostKey)
        : startSecureFileHost(SECURE_FILE_HOST_PORT);
    __host.emitter.on("codeReady", async ({ code }) => {
        logInfo("File host: code received (incoming connection request)");
        try {
            const window = await openMainWindow();
            window.webContents.send("file-host-code", JSON.stringify({ code }));
        } catch (err) {
            logErr("Failed sending file host code to window", err);
        }
    });
    __host.emitter.on("connected", () => {
        logInfo("File host: client connected");
        const window = getMainWindow();
        if (window) {
            window.webContents.send("file-host-code", JSON.stringify({ code: null }));
        }
    });
    if (!fileHostKey) {
        const newKey = __host.key;
        logInfo("New file host key generated");
        await setConfigValue("fileHostKey", newKey);
    }
}

export async function stopFileHost() {
    if (!__host) return;
    logInfo("Stopping file host");
    __host.stop();
    __host = null;
}
