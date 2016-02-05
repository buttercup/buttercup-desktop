"use strict";

class Platform {

    static isOSX() {
        return process.platform === 'darwin';
    }

    static isWindows() {
        return process.platform === 'win32';
    }

    static isLinux() {
        return process.platform === 'linux';
    }

}

module.exports = Platform;
