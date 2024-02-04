const path = require("path");
const { flipFuses, FuseVersion, FuseV1Options } = require("@electron/fuses");
const { Arch } = require("electron-builder");

// From: https://github.com/electron-userland/electron-builder/issues/6365#issuecomment-1526262846
async function addElectronFuses(context) {
    const { electronPlatformName, arch } = context;
    const ext = {
        darwin: ".app",
        win32: ".exe",
        linux: [""]
    }[electronPlatformName];

    const IS_LINUX = context.electronPlatformName === "linux";
    const executableName = IS_LINUX
        ? context.packager.appInfo.productFilename
              .toLowerCase()
              .replace("-dev", "")
              .replace(" ", "-")
        : context.packager.appInfo.productFilename;
    const electronBinaryPath = path.join(context.appOutDir, `${executableName}${ext}`);

    console.log(
        `Configuring fuses for binary: ${electronBinaryPath} (reset adhoc: ${
            electronPlatformName === "darwin" && arch === Arch.universal
        })`
    );

    await flipFuses(electronBinaryPath, {
        version: FuseVersion.V1,
        resetAdHocDarwinSignature: electronPlatformName === "darwin",
        [FuseV1Options.EnableCookieEncryption]: true,
        [FuseV1Options.RunAsNode]: false,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
        // Mac app crashes when enabled for us on arm, might be fine for you
        [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false,
        // https://github.com/electron/fuses/issues/7
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false
    });
}

module.exports = async (context) => {
    console.log(`Checking package: ${context.electronPlatformName} @ ${context.arch}`);
    if (context.electronPlatformName !== "darwin" || context.arch === Arch.x64) {
        await addElectronFuses(context);
    }
};
