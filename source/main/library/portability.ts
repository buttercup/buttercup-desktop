const { PORTABLE_EXECUTABLE_APP_FILENAME } = process.env;

export function isPortable() {
    return !!PORTABLE_EXECUTABLE_APP_FILENAME;
}
