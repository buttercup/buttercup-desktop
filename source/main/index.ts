import { app } from "electron";
import "./ipc";
import { initialise } from "./services/init";
import { openMainWindow } from "./services/windows";
import { handleProtocolCall } from "./services/protocol";
import { BUTTERCUP_PROTOCOL, PLATFORM_MACOS } from "./symbols";

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
    openMainWindow();
});

app.on("second-instance", async (event, args) => {
    await openMainWindow();
    // Protocol URL for Linux/Windows
    const protocolURL = args.find(arg => arg.startsWith(BUTTERCUP_PROTOCOL));
    if (protocolURL) {
        handleProtocolCall(protocolURL);
    }
});
app.on("open-url", (e, url) => {
    // Protocol URL for MacOS
    if (url.startsWith(BUTTERCUP_PROTOCOL)) {
        handleProtocolCall(url);
    }
});

app.whenReady()
    .then(() => initialise())
    .then(() => openMainWindow())
    .catch(err => {
        console.error(err);
    });
