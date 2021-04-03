const { PORTABLE_EXECUTABLE_APP_FILENAME, PORTABLE_EXECUTABLE_DIR } = process.env;

export function getPortableExeDir(): string {
    return PORTABLE_EXECUTABLE_DIR;
}

export function isPortable(): boolean {
    return !!PORTABLE_EXECUTABLE_APP_FILENAME;
}
