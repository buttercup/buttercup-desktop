import { ipcRenderer } from "electron";
import { Preferences } from "../types";

export async function getPreferences(): Promise<Preferences> {
    const getPreferencesPromise = new Promise<Preferences>(resolve => {
        ipcRenderer.once("get-preferences:reply", (evt, payload) => {
            resolve(JSON.parse(payload));
        });
    });
    ipcRenderer.send("get-preferences");
    const prefs = await getPreferencesPromise;
    return prefs;
}
