const { resolve } = require("node:path");
const { exec } = require("node:child_process");
const { promisify } = require("node:util");
const builder = require("electron-builder");
const { rimraf } = require("rimraf");
const chalk = require("chalk");

const BUILD_DIR = resolve(__dirname, "../../build");
const DIST_DIR = resolve(__dirname, "../../dist");
const EXPECTED_ENV_VARS = [
    "APPLE_ID",
    "APPLE_APP_SPECIFIC_PASSWORD",
    "APPLE_TEAM_ID",
    "GH_TOKEN",
    "WIN_YUBIKEY_PIN"
];

async function buildApp() {
    console.log("Building...");
    await promisify(exec)("npm run build");
}

async function buildBundle() {
    console.log("Assembling bundles...");
    const result = await builder.build({
        publish: "always",
        targets: new Map([
            ...builder.Platform.MAC.createTarget(),
            ...builder.Platform.LINUX.createTarget(),
            ...builder.Platform.WINDOWS.createTarget()
        ])
    });
    console.log("Outputs:");
    for (const item of result) {
        console.log(`  ${chalk.green("•")} ${item}`);
    }
}

async function check() {
    for (const envVar of EXPECTED_ENV_VARS) {
        if (typeof process.env[envVar] !== "string") {
            throw new Error(`Environment variable not set: ${envVar}`);
        }
    }
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

routine(check, clean, buildApp, buildBundle)
    .then(() => {
        console.log("Done.");
    })
    .catch(console.error);
