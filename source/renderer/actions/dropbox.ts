import { authenticate } from "../services/auth3rdParty";
import { DROPBOX_CLIENT_ID } from "../../shared/symbols";

const DROPBOX_REDIRECT_URL = "https://buttercup.pw/";

export async function authDropbox(): Promise<string> {
    const authUri = `https://www.dropbox.com/1/oauth2/authorize?client_id=${DROPBOX_CLIENT_ID}&redirect_uri=${DROPBOX_REDIRECT_URL}&response_type=token`;
    return authenticate(authUri, /access_token=([^&]*)/);
}
