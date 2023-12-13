import { app } from "electron";

export async function setStartWithSession(enable: boolean): Promise<void> {
    const isEnabled = app.getLoginItemSettings().openAtLogin;
    if (enable && !isEnabled) {
        app.setLoginItemSettings({
            openAtLogin: true,
            args: ["--autostart"]
        });
    } else if (!enable && isEnabled) {
        app.setLoginItemSettings({
            openAtLogin: false,
            args: []
        });
    }
}
