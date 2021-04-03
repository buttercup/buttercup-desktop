import { getPasswordEmitter } from "../services/password";
import { showPasswordPrompt } from "../state/password";

export async function getPrimaryPassword(): Promise<string | null> {
    showPasswordPrompt(true);
    const emitter = getPasswordEmitter();
    const password = await new Promise<string | null>(resolve => {
        const callback = (password: string | null) => {
            resolve(password);
            emitter.removeListener("password", callback);
        };
        emitter.once("password", callback);
    });
    showPasswordPrompt(false);
    return password;
}
