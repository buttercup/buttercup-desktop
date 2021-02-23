import { Menu } from "electron";
import { VaultSourceStatus } from "buttercup";
import { getSourceDescriptions, lockAllSources } from "../services/buttercup";
import { closeWindows, openMainWindow } from "../services/windows";

async function getContextMenu(): Promise<Menu> {
    const sources = getSourceDescriptions();
    return Menu.buildFromTemplate([
        {
            label: "",
            submenu: [
                { label: "About" },
                { label: "Preferences" },
                { type: "separator" },
                {
                    label: "Close Window",
                    click: () => closeWindows()
                },
                { label: "Quit", role: "quit" }
            ]
        },
        {
            label: "Vault",
            submenu: [
                {
                    label: "Add New",
                    click: async () => {
                        const window = await openMainWindow();
                        window.webContents.send("add-vault");
                    }
                },
                { type: "separator" },
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
                    label: "Lock All",
                    click: () => lockAllSources()
                }
            ]
        },
        {
            label: "Edit",
            role: "editMenu"
        }
    ]);
}

export async function updateAppMenu() {
    const menu = await getContextMenu();
    Menu.setApplicationMenu(menu);
}
