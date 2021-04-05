import path from "path";
import { isLinux, isWindows } from "../../shared/library/platform";

export function getIconPath(): string {
    const trayPath = isWindows() ? "tray.ico" : isLinux() ? "tray-linux.png" : "trayTemplate.png";
    return path.resolve(__dirname, "../../../resources/icons", trayPath);
}
