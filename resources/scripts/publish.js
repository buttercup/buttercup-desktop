const { resolve } = require("node:path");
const { exec } = require("node:child_process");
const { promisify } = require("node:util");
const builder = require("electron-builder");
const { rimraf } = require("rimraf");

const BUILD_DIR = resolve(__dirname, "../../build");
const DIST_DIR = resolve(__dirname, "../../dist");

async function buildApp() {
    console.log("Building...");
    await promisify(exec)("npm run build");
}

async function buildMac() {
    console.log("Building Mac...");
    const result = await builder.build({
        targets: builder.Platform.MAC.createTarget()
    });
    console.log("Result:", result);
}

async function buildLinux() {
    console.log("Building Linux...");
    const result = await builder.build({
        targets: builder.Platform.LINUX.createTarget()
    });
    console.log("Result:", result);
}

async function clean() {
    console.log("Cleaning...");
    await rimraf(BUILD_DIR);
    await rimraf(DIST_DIR);
}

async function routine(...callbacks) {
    while (callbacks.length > 0) {
        const callback = callbacks.shift();
        await callback();
    }
}

routine(clean, buildApp, buildLinux)
    .then(() => {
        console.log("Done.");
    })
    .catch(console.error);
