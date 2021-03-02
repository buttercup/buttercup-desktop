import { Menu, Tray } from "electron";
import { VaultSourceStatus } from "buttercup";
import { getSourceDescriptions, lockAllSources } from "../services/buttercup";
import { openMainWindow } from "../services/windows";
import { getIconPath } from "../library/tray";

let __tray: Tray = null;

async function getContextMenu(): Promise<Menu> {
    const sources = getSourceDescriptions();
    const unlockedCount = sources.reduce((count, desc) => desc.state === VaultSourceStatus.Unlocked ? count + 1 : count, 0);
    return Menu.buildFromTemplate([
        {
            label: `${unlockedCount} unlocked vaults`,
            enabled: false,
        },
        {
            type: "separator"
        },
        {
            label: "Open",
            click: () => openMainWindow()
        },
        {
            type: "separator"
        },
        {
            label: "Lock All",
            click: () => lockAllSources()
        },
        {
            label: "Open Vault",
            submenu: sources.map(source => ({
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
            label: "Quit",
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
