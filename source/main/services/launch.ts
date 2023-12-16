import path from "node:path";
import fs from "node:fs/promises";
import { app } from "electron";
import untildify from "untildify";
import { pathExists } from "path-exists";
import { isLinux } from "../../shared/library/platform";

const LINUX_AUTOSTART_DIR = "~/.config/autostart";
const LINUX_DESKTOP = `
[Desktop Entry]
Type=Application
Version=1.0
Name={{APP_NAME}}
Comment={{APP_NAME}} startup script
Exec={{APP_PATH}} --autostart
StartupNotify=false
Terminal=false
`;

export async function setStartWithSession(enable: boolean): Promise<void> {
    if (isLinux()) {
        await setStartWithSessionLinux(enable);
    } else {
        await setStartWithSessionNative(enable);
    }
}

async function setStartWithSessionLinux(enable: boolean): Promise<void> {
    const autostartPath = path.join(untildify(LINUX_AUTOSTART_DIR), "buttercup.desktop");
    const isEnabled = await pathExists(autostartPath);
    let execPath = process.env?.APPIMAGE ? process.env.APPIMAGE : process.execPath;
    execPath = execPath.replace(/(\s+)/g, "\\$1");
    if (enable && !isEnabled) {
        const desktop = LINUX_DESKTOP.trim()
            .replace(/{{APP_NAME}}/g, "Buttercup")
            .replace(/{{APP_PATH}}/g, execPath);
        await fs.writeFile(autostartPath, desktop);
    } else if (!enable && isEnabled) {
        await fs.unlink(autostartPath);
    }
}

async function setStartWithSessionNative(enable: boolean): Promise<void> {
    const isEnabled = app.getLoginItemSettings().openAtLogin;
    if (enable && !isEnabled) {
        app.setLoginItemSettings({
            openAsHidden: true,
            openAtLogin: true,
            args: ["--autostart"]
        });
    } else if (!enable && isEnabled) {
        app.setLoginItemSettings({
            openAsHidden: false,
            openAtLogin: false,
            args: []
        });
    }
}
