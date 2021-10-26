import { ipcRenderer } from "electron";
import debounce from "debounce";

function handleActivity() {
    ipcRenderer.invoke("trigger-user-presence");
}

export function initialisePresence(rootElement: HTMLElement) {
    const handler = debounce(handleActivity, 250);
    rootElement.addEventListener("mousemove", handler);
}
