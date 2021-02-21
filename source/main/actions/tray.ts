import path from "path";
import { Menu, Tray } from "electron";
import { VaultSourceStatus } from "buttercup";
import { isLinux, isWindows } from "../../shared/library/platform";
import { getSourceDescriptions, lockAllSources } from "../services/buttercup";
import { openMainWindow } from "../services/windows";

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
            label: "Unlock",
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
            type: "separator"
        },
        {
            label: "Quit",
            role: "quit"
        }
    ]);
}

export async function updateTrayIcon() {
    let trayPath = isWindows()
        ? "tray.ico"
        : isLinux()
            ? "tray-linux.png"
            : "trayTemplate.png";
    trayPath = path.resolve(__dirname, "../../../resources/icons", trayPath);
    if (!__tray) {
        __tray = new Tray(trayPath);
    }
    const contextMenu = await getContextMenu();
    __tray.setContextMenu(contextMenu);
}
