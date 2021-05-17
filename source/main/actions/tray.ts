import { Menu, Tray } from "electron";
import { VaultSourceStatus } from "buttercup";
import { getSourceDescriptions, lockAllSources } from "../services/buttercup";
import { openAndRepositionMainWindow, openMainWindow } from "../services/windows";
import { getIconPath } from "../library/tray";
import { logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";

let __tray: Tray = null;

async function getContextMenu(): Promise<Menu> {
    const sources = getSourceDescriptions();
    const unlockedCount = sources.reduce(
        (count, desc) => (desc.state === VaultSourceStatus.Unlocked ? count + 1 : count),
        0
    );
    return Menu.buildFromTemplate([
        {
            label: t("app-menu.unlocked-vaults", { count: unlockedCount }),
            enabled: false
        },
        {
            type: "separator"
        },
        {
            label: t("app-menu.open"),
            click: () => openMainWindow()
        },
        {
            label: t("app-menu.window"),
            submenu: [
                {
                    label: t("app-menu.window-reposition"),
                    click: () => openAndRepositionMainWindow()
                }
            ]
        },
        {
            type: "separator"
        },
        {
            label: t("app-menu.add-new-vault"),
            click: async () => {
                const window = await openMainWindow();
                window.webContents.send("add-vault");
            }
        },
        {
            label: t("app-menu.lock-all"),
            click: () => {
                logInfo("Locking all sources");
                lockAllSources();
            }
        },
        {
            label: t("app-menu.open-vault"),
            submenu: sources.map((source) => ({
                label: source.name,
                click: async () => {
                    const window = await openMainWindow();
                    if (source.state === VaultSourceStatus.Unlocked) {
                        window.webContents.send("open-source", source.id);
                    } else {
                        window.webContents.send("unlock-vault-open", source.id);
                    }
                }
            }))
        },
        {
            type: "separator"
        },
        {
            label: t("app-menu.quit"),
            role: "quit"
        }
    ]);
}

export async function updateTrayIcon() {
    if (!__tray) {
        __tray = new Tray(getIconPath());
    }
    const contextMenu = await getContextMenu();
    __tray.setContextMenu(contextMenu);
}
