import path from "path";
import { app, BrowserWindow } from "electron";
import debounce from "debounce";
import "./ipc";
import { initialise } from "./services/init";
import { getConfigValue, setConfigValue} from "./services/config";
import { PLATFORM_MACOS } from "./symbols";

async function createVaultWindow() {
    const width = await getConfigValue<number>("windowWidth");
    const height = await getConfigValue<number>("windowHeight");
    const win = new BrowserWindow({
        width,
        height,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            spellcheck: false
        }
    })
    win.on("resize", debounce(() => handleWindowResize(win), 750, false));
    win.loadFile(path.resolve(__dirname, "../renderer/index.html"));
}

async function handleWindowResize(win: BrowserWindow) {
    const [newWidth, newHeight] = win.getSize();
    await setConfigValue("windowWidth", newWidth);
    await setConfigValue("windowHeight", newHeight);
}

const lock = app.requestSingleInstanceLock();
if (!lock) {
    app.quit();
}

app.on("window-all-closed", () => {
  if (process.platform !== PLATFORM_MACOS) {
      app.quit();
  }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createVaultWindow();
    }
});

app.on("second-instance", (event, args) => {
    // @todo handle second instance
});

app.whenReady()
    .then(() => initialise())
    .then(() => createVaultWindow())
    .catch(err => {
        console.error(err);
    });
