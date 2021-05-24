import { showError } from "../services/notifications";
import { logErr } from "../library/log";

export function handleError(err: Error): void {
    logErr(err);
    showError(err.message);
}
