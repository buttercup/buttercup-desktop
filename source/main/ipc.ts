import { VaultFacade, VaultSourceID, VaultSourceStatus } from "buttercup";
import { BrowserWindow, clipboard, ipcMain } from "electron";
import { Layerr } from "layerr";
import {
    addVaultFromPayload,
    showExistingFileVaultDialog,
    showNewFileVaultDialog
} from "./actions/connect";
import { unlockSourceWithID } from "./actions/unlock";
import { lockSourceWithID } from "./actions/lock";
import { removeSourceWithID } from "./actions/remove";
import { handleConfigUpdate } from "./actions/config";
import {
    getEmptyVault,
    getSourceStatus,
    saveVaultFacade,
    sendSourcesToWindows,
    toggleAutoUpdate
} from "./services/buttercup";
import { getVaultFacade } from "./services/facades";
import { getConfigValue, setConfigValue } from "./services/config";
import { getOSLocale } from "./services/locale";
import { searchSingleVault } from "./services/search";
import {
    getCurrentUpdate,
    getReadyUpdate,
    installUpdate,
    muteUpdate,
    startUpdate
} from "./services/update";
import { getLastSourceID, setLastSourceID } from "./services/lastVault";
import {
    enableSourceBiometricUnlock,
    getSourcePasswordViaBiometrics,
    sourceEnabledForBiometricUnlock,
    supportsBiometricUnlock
} from "./services/biometrics";
import { log as logRaw, logInfo, logErr } from "./library/log";
import { isPortable } from "./library/portability";
import { AppEnvironmentFlags, AddVaultPayload, LogLevel, Preferences, SearchResult } from "./types";

// **
// ** IPC Events
// **

ipcMain.on("add-vault-config", async (evt, payload) => {
    const addVaultPayload: AddVaultPayload = JSON.parse(payload);
    try {
        const sourceID = await addVaultFromPayload(addVaultPayload);
        evt.reply(
            "add-vault-config:reply",
            JSON.stringify({
                ok: true,
                sourceID
            })
        );
    } catch (err) {
        console.error(err);
        evt.reply(
            "add-vault-config:reply",
            JSON.stringify({
                ok: false,
                error: err.message
            })
        );
    }
});

ipcMain.on("get-empty-vault", async (evt, payload) => {
    const { password } = JSON.parse(payload);
    const vault = await getEmptyVault(password);
    evt.reply("get-empty-vault:reply", vault);
});

ipcMain.on("get-preferences", async (evt, sourceID) => {
    const prefs = await getConfigValue<Preferences>("preferences");
    evt.reply("get-preferences:reply", JSON.stringify(prefs));
});

ipcMain.on("get-vault-facade", async (evt, sourceID) => {
    const facade = await getVaultFacade(sourceID);
    evt.reply("get-vault-facade:reply", JSON.stringify(facade));
});

ipcMain.on("lock-source", async (evt, payload) => {
    const { sourceID } = JSON.parse(payload);
    try {
        await lockSourceWithID(sourceID);
        if (getLastSourceID() === sourceID) {
            setLastSourceID(null);
        }
        evt.reply(
            "lock-source:reply",
            JSON.stringify({
                ok: true
            })
        );
    } catch (err) {
        logErr("Failed locking vault source", err);
        evt.reply(
            "lock-source:reply",
            JSON.stringify({
                ok: false,
                error: err.message
            })
        );
    }
});

ipcMain.on("log", async (evt, payload) => {
    const { level, log } = JSON.parse(payload) as {
        level: LogLevel;
        log: string;
    };
    logRaw(level, [log]);
});

ipcMain.on("remove-source", async (evt, payload) => {
    const { sourceID } = JSON.parse(payload);
    await removeSourceWithID(sourceID);
});

ipcMain.on("save-vault-facade", async (evt, payload) => {
    const { sourceID, vaultFacade } = JSON.parse(payload) as {
        sourceID: VaultSourceID;
        vaultFacade: VaultFacade;
    };
    try {
        await saveVaultFacade(sourceID, vaultFacade);
        evt.reply(
            "save-vault-facade:reply",
            JSON.stringify({
                ok: true
            })
        );
    } catch (err) {
        logErr("Failed saving vault facade", err);
        evt.reply(
            "save-vault-facade:reply",
            JSON.stringify({
                ok: false,
                error: err.message
            })
        );
    }
});

ipcMain.on("update-vault-windows", () => {
    sendSourcesToWindows();
});

ipcMain.on("write-preferences", async (evt, payload) => {
    const { preferences } = JSON.parse(payload) as { preferences: Preferences };
    await setConfigValue("preferences", preferences);
    // Apply theme change
    await handleConfigUpdate(preferences);
});

// **
// ** IPC Handlers
// **

ipcMain.handle("check-source-biometrics", async (_, sourceID: VaultSourceID) => {
    const supportsBiometrics = await supportsBiometricUnlock();
    if (!supportsBiometrics) return false;
    return sourceEnabledForBiometricUnlock(sourceID);
});

ipcMain.handle(
    "get-app-environment",
    async (): Promise<AppEnvironmentFlags> => ({
        portable: isPortable()
    })
);

ipcMain.handle("get-biometric-source-password", async (_, sourceID: VaultSourceID) => {
    return getSourcePasswordViaBiometrics(sourceID);
});

ipcMain.handle("get-current-update", getCurrentUpdate);

ipcMain.handle("get-existing-vault-filename", async (evt) => {
    const win = BrowserWindow.fromWebContents(evt.sender);
    if (!win) {
        // @todo record error
    }
    const filename = await showExistingFileVaultDialog(win as BrowserWindow);
    return filename;
});

ipcMain.handle("get-new-vault-filename", async (evt) => {
    const win = BrowserWindow.fromWebContents(evt.sender);
    if (!win) {
        // @todo record error
    }
    const filename = await showNewFileVaultDialog(win as BrowserWindow);
    return filename;
});

ipcMain.handle("get-ready-update", getReadyUpdate);

ipcMain.handle("get-selected-source", async () => {
    const sourceID = await getConfigValue<VaultSourceID>("selectedSource");
    return sourceID;
});

ipcMain.handle("get-locale", getOSLocale);

ipcMain.handle("install-update", installUpdate);

ipcMain.handle("mute-current-update", muteUpdate);

ipcMain.handle(
    "register-biometric-unlock",
    async (_, sourceID: VaultSourceID, password: string) => {
        await enableSourceBiometricUnlock(sourceID, password);
    }
);

ipcMain.handle(
    "search-single-vault",
    async (_, sourceID, term): Promise<Array<SearchResult>> => {
        const results = await searchSingleVault(sourceID, term);
        return results.map((res) => ({
            type: "entry",
            result: res
        }));
    }
);

ipcMain.handle("set-selected-source", async (_, sourceID: VaultSourceID) => {
    await setConfigValue("selectedSource", sourceID);
    const status = getSourceStatus(sourceID);
    if (status === VaultSourceStatus.Unlocked) {
        setLastSourceID(sourceID);
    } else {
        setLastSourceID(null);
    }
});

ipcMain.handle("start-current-update", async () => {
    await startUpdate();
});

ipcMain.handle("toggle-auto-update", async (_, enable: boolean) => {
    await toggleAutoUpdate(enable);
    if (enable) {
        logInfo("Enabled auto-update");
    } else {
        logInfo("Disabled auto-update");
    }
});

ipcMain.handle("unlock-source", async (evt, sourceID: VaultSourceID, password: string) => {
    try {
        await unlockSourceWithID(sourceID, password);
        setLastSourceID(sourceID);
    } catch (err) {
        logErr("Failed unlocking vault source", err);
        throw new Layerr(err, "Failed unlocking vault source");
    }
});

ipcMain.handle("write-clipboard", (_, text: string) => {
    clipboard.writeText(text);
});
