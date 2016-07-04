# Buttercup
Cross-platform, free and open-source password manager based on NodeJS.

[![Build Status](https://travis-ci.org/buttercup-pw/buttercup.svg?branch=master)](https://travis-ci.org/buttercup-pw/buttercup) [![Github All Releases](https://img.shields.io/github/downloads/buttercup-pw/buttercup/total.svg)](https://github.com/buttercup-pw/buttercup/releases) [![Code Climate](https://codeclimate.com/github/buttercup-pw/buttercup/badges/gpa.svg)](https://codeclimate.com/github/buttercup-pw/buttercup) [![encryption](https://img.shields.io/badge/Encryption-AES%20256%20CBC-red.svg)](https://tools.ietf.org/html/rfc3602) [![Gitter](https://img.shields.io/gitter/room/buttercup-cpre/buttercup.svg)](https://gitter.im/buttercup-pw/buttercup)

![Buttercup](http://perrymitchell.net/article/buttercup-first-release-0-1-0-alpha/buttercup-screen-2.png)

## Under Development
Buttercup is currently under heavy development, and updates will be pushed here very frequently.
The application is currently in alpha, and should be considered unstable.

Please check [buttercup-core](https://github.com/perry-mitchell/buttercup-core) for more information on Buttercup’s core module. Check out the [release changelog](CHANGELOG.md) for more information on updates.

## Encryption & Format
Buttercup uses a delta-system to manage archive changes and save conflicts. The archive, upon saving, is encrypted with AES 256bit CBC mode with a SHA256 HMAC. Encryption is performed once the password has been salted and prepared with PBKDF2 at 1000 iterations.

Because security with password storage is of the utmost importance, Buttercup will remain in alpha/beta release mode until some level of professional scrutiny has occurred. It is completely possible that security-related changes will occur, but this is inevitable and we handle every question and criticism with great care when it comes to the safety of using our software.

## Installing
You can install a release of Buttercup by checking out the [releases page](https://github.com/buttercup-pw/buttercup/releases).

## Setup & Usage
### Install Dependencies
``` bash
$ npm install
```

### Running in development environment
``` bash
$ npm run dev
```

### Building libraries before releasing
```bash
$ npm run build
```

### Required software
You will need the following things to build the project executables and installers:
 * NSIS (makensis in homebrew)
 * dpkg
 * wine ([install guide in homebrew](https://www.davidbaumgold.com/tutorials/wine-mac/#part-1:-install-homebrew))

### Package
To package Buttercup for all platforms and make installers:
```bash
$ npm run release-all
```
This may take a while depending on how fast your computer is. All apps and installers will be in `dist` directory.

To package only for the current platform:
```bash
$ npm run release
```

## Contributors
### Creation
 * Sallar ([@sallar](https://twitter.com/sallar))
 * Perry ([@perry_mitchell](https://twitter.com/perry_mitchell))

### Contributions
 * Mohammad Amiri (logo) ([@pixelvisualize](https://twitter.com/pixelvisualize))

## License
Released under [GNU/GPL Version 3](LICENSE)
