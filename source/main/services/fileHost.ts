import { startFileHost as startSecureFileHost } from "@buttercup/secure-file-host";
import { logInfo } from "../library/log";
import { getConfigValue, setConfigValue } from "./config";
import { SECURE_FILE_HOST_PORT } from "../symbols";

let __host = null;

export async function startFileHost() {
    if (__host) return;
    const fileHostKey = await getConfigValue<string>("fileHostKey");
    logInfo(`Starting file host (key exists: ${!!fileHostKey})`);
    __host = fileHostKey ? startSecureFileHost(SECURE_FILE_HOST_PORT, fileHostKey) : startSecureFileHost(SECURE_FILE_HOST_PORT);
    // __host.emitter.on('codeReady', ({ code }) => showConnectionWindow(code));
    // __host.emitter.on('connected', () => {
    //     const [connectionWindow] = windowManager.getWindowsOfType(
    //     'file-host-connection'
    //     );
    //     if (connectionWindow) {
    //     connectionWindow.close();
    //     }
    // });
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
