import { AuthType, createClient } from "webdav";
import { Layerr } from "layerr";
import { logInfo } from "../library/log";

export async function testWebDAV(url: string, username?: string, password?: string): Promise<void> {
    const authentication = !!(username && password);
    const client = authentication
        ? createClient(url, {
              authType: AuthType.Auto,
              username,
              password
          })
        : createClient(url);
    logInfo(`Testing WebDAV connection: ${url} (authenticated: ${authentication ? "yes" : "no"})`);
    try {
        await client.getDirectoryContents("/");
    } catch (err) {
        throw new Layerr(err, "Failed connecting to WebDAV service");
    }
}
