import { Menu } from "electron";
import { VaultSourceStatus } from "buttercup";
import { getSourceDescriptions, lockAllSources, lockSource } from "../services/buttercup";
import { closeWindows, getMainWindow, openMainWindow } from "../services/windows";
import { getConfigValue, setConfigValue } from "../services/config";
import { getLastSourceID } from "../services/lastVault";
import {
    disableSourceBiometricUnlock,
    sourceEnabledForBiometricUnlock,
    supportsBiometricUnlock
} from "../services/biometrics";
import { IMPORTERS, startImport } from "../services/import";
import { exportVaultSource } from "../services/export";
import { handleConfigUpdate } from "./config";
import { t } from "../../shared/i18n/trans";
import { isOSX } from "../../shared/library/platform";
import { getIconForProvider, getNativeImageMenuIcon } from "../library/icons";
import { logErr } from "../library/log";

async function getContextMenu(): Promise<Menu> {
    const sources = getSourceDescriptions();
    const lastSourceID = getLastSourceID();
    const lastSource = sources.find((source) => source.id === lastSourceID) || null;
    const preferences = await getConfigValue("preferences");
    const currentVaultPrefix = [];
    const biometricsSupported = await supportsBiometricUnlock();
    let biometricsEnabled = false,
        lastSourceUnlocked = false;
    if (lastSource) {
        lastSourceUnlocked = lastSource.state === VaultSourceStatus.Unlocked;
        currentVaultPrefix.push(
            {
                label: lastSource.name,
                enabled: false,
                icon: await getNativeImageMenuIcon(getIconForProvider(lastSource.type))
            },
            { type: "separator" }
        );
        biometricsEnabled = await sourceEnabledForBiometricUnlock(lastSource.id);
    }
    return Menu.buildFromTemplate([
        {
            label: "Buttercup",
            submenu: [
                {
                    label: t("app-menu.about"),
                    click: async () => {
                        const window = await openMainWindow();
                        window.webContents.send("open-about");
                    }
                },
                {
                    label: t("app-menu.preferences"),
                    click: async () => {
                        const window = await openMainWindow();
                        window.webContents.send("open-preferences");
                    }
                },
                { type: "separator" },
                {
                    label: t("app-menu.close-window"),
                    click: () => closeWindows()
                },
                { label: t("app-menu.quit"), role: "quit" }
            ]
        },
        {
            label: t("app-menu.vaults"),
            submenu: [
                {
                    label: t("app-menu.add-new-vault"),
                    click: async () => {
                        const window = await openMainWindow();
                        window.webContents.send("add-vault");
                    }
                },
                { type: "separator" },
                {
                    label: t("app-menu.unlock-vault"),
                    submenu: sources.map((source) => ({
                        label: source.name,
                        enabled: source.state === VaultSourceStatus.Locked,
                        click: async () => {
                            const window = await openMainWindow(`/source/${source.id}`);
                            window.webContents.send("unlock-vault", source.id);
                        }
                    }))
                },
                {
                    label: t("app-menu.lock-all"),
                    accelerator: isOSX() ? "Cmd+Alt+L" : "Ctrl+Alt+L",
                    click: () => lockAllSources()
                }
            ]
        },
        {
            label: t("app-menu.current"),
            submenu: [
                ...currentVaultPrefix,
                {
                    label: t("app-menu.search"),
                    enabled: !!lastSource,
                    accelerator: isOSX() ? "Cmd+F" : "Ctrl+F",
                    click: async () => {
                        const window = await openMainWindow();
                        window.webContents.send("open-search");
                    }
                },
                { type: "separator" },
                {
                    label: t("app-menu.biometrics"),
                    enabled: !!lastSource && biometricsSupported,
                    type: "checkbox",
                    checked: biometricsEnabled,
                    click: async () => {
                        if (biometricsEnabled) {
                            const mainWindow = getMainWindow();
                            try {
                                await disableSourceBiometricUnlock(lastSourceID);
                                if (mainWindow) {
                                    mainWindow.webContents.send(
                                        "notify-success",
                                        t("notification.biometrics-disabled")
                                    );
                                }
                            } catch (err) {
                                logErr(
                                    `Failed disabling biometrics for source: ${lastSourceID}`,
                                    err
                                );
                                if (mainWindow) {
                                    mainWindow.webContents.send(
                                        "notify-error",
                                        t("notification.error.biometrics-disable-failed", {
                                            error: err.message
                                        })
                                    );
                                }
                            }
                        } else {
                            const window = await openMainWindow(`/source/${lastSourceID}`);
                            window.webContents.send("open-biometric-registration");
                        }
                    }
                },
                { type: "separator" },
                {
                    label: t("app-menu.lock-current-vault"),
                    enabled: !!lastSource && lastSourceUnlocked,
                    accelerator: isOSX() ? "Cmd+L" : "Ctrl+L",
                    click: async () => {
                        if (lastSource.state !== VaultSourceStatus.Unlocked) {
                            return;
                        }
                        return lockSource(lastSource.id);
                    }
                },
                { type: "separator" },
                {
                    label: t("app-menu.import"),
                    enabled: !!lastSource && lastSourceUnlocked,
                    submenu: IMPORTERS.map(([importer, extension, importerConstructor]) => ({
                        label: `${importer} (${extension.toUpperCase()})`,
                        enabled: !!lastSource && lastSourceUnlocked,
                        click: () => {
                            startImport(
                                lastSourceID,
                                importer,
                                extension,
                                importerConstructor
                            ).catch(async (err) => {
                                logErr("Import failed", err);
                                const window = await openMainWindow();
                                window.webContents.send("notify-error", err.message);
                            });
                        }
                    }))
                },
                {
                    label: t("app-menu.export"),
                    enabled: !!lastSource && lastSourceUnlocked,
                    click: async () => {
                        await exportVaultSource(lastSourceID);
                    }
                }
            ]
        },
        {
            label: t("app-menu.connection"),
            submenu: [
                {
                    label: t("app-menu.enable-secure-file-host"),
                    type: "checkbox",
                    checked: preferences.fileHostEnabled,
                    click: async () => {
                        const prefs = await getConfigValue("preferences");
                        prefs.fileHostEnabled = !prefs.fileHostEnabled;
                        await setConfigValue("preferences", prefs);
                        await updateAppMenu();
                        await handleConfigUpdate(prefs);
                    }
                }
            ]
        },
        {
            label: t("app-menu.edit"),
            role: "editMenu"
        },
        {
            label: t("app-menu.view"),
            role: "viewMenu"
        },
        {
            label: t("app-menu.debug"),
            submenu: [{ label: t("app-menu.devtool"), role: "toggleDevTools" }]
        }
    ]);
}

export async function updateAppMenu() {
    const menu = await getContextMenu();
    Menu.setApplicationMenu(menu);
}
