import { createClient } from "webdav";
import { Layerr} from "layerr";

export async function testWebDAV(url: string, username?: string, password?: string): Promise<void> {
    const client = username && password
        ? createClient(url, {
            username,
            password
        })
        : createClient(url);
    try {
        await client.getDirectoryContents("/");
    } catch (err) {
        throw new Layerr(err, "Failed connecting to WebDAV service");
    }
}
