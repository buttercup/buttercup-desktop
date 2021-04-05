import fs from "fs";

export async function fileExists(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
        fs.access(filePath, (err?: Error) => {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        });
    });
}
