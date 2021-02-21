import fs from "fs";
import path from "path";
import rotate from "log-rotate";
import pify from "pify";
import { LOG_PATH } from "./storage";

const appendFile = pify(fs.appendFile);
const mkdir = pify(fs.mkdir);

const LOG_RETENTION = 10;

export async function initialise() {
    await mkdir(path.dirname(LOG_PATH), { recursive: true });
    await new Promise<void>((resolve, reject) => {
        rotate(LOG_PATH, { count: LOG_RETENTION, compress: false }, error => {
            if (error) return reject(error);
            resolve();
        });
    });
}

export async function writeLines(lines: Array<string>): Promise<void> {
    await appendFile(LOG_PATH, `${lines.join("\n")}\n`);
}
