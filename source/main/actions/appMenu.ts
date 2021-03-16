import { Menu } from "electron";
import { VaultSourceStatus } from "buttercup";
import { getSourceDescriptions, lockAllSources } from "../services/buttercup";
import { closeWindows, openMainWindow } from "../services/windows";
import { getConfigValue, setConfigValue } from "../services/config";
import { handleConfigUpdate } from "./config";
import { t } from "../../shared/i18n/trans";
import { Preferences } from "../types";

async function getContextMenu(): Promise<Menu> {
    const sources = getSourceDescriptions();
    const preferences = await getConfigValue<Preferences>("preferences");
    return Menu.buildFromTemplate([
        {
            label: "Buttercup",
            submenu: [
                { label: t("app-menu.about") },
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
            label: t("app-menu.vault"),
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
                    submenu: sources.map(source => ({
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
                    click: () => lockAllSources()
                },
                { type: "separator" },
                {
                    label: "Search",
                    click: async () => {
                        const window = await openMainWindow();
                        window.webContents.send("open-search");
                    }
                }

            ]
        },
        {
            label: "Connection",
            submenu: [
                {
                    label: "Enable browser access",
                    type: "checkbox",
                    checked: preferences.fileHostEnabled,
                    click: async () => {
                        const prefs = await getConfigValue<Preferences>("preferences");
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
            label: t("app-menu.debug"),
            submenu: [
                { label: t("app-menu.devtool"), role: "toggleDevTools" }
            ]
        }
    ]);
}

export async function updateAppMenu() {
    const menu = await getContextMenu();
    Menu.setApplicationMenu(menu);
}
