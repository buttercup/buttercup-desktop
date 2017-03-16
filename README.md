<h1 align="center">
  <br/>
  <img src="https://cdn.rawgit.com/buttercup-pw/buttercup-assets/054fc0fa/badge/desktop.svg" alt="Buttercup Desktop">
  <br/>
  <br/>
  <br/>
</h1>

> Cross-platform, free and open-source password manager based on NodeJS.

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![Build Status](https://travis-ci.org/buttercup-pw/buttercup.svg?branch=master)](https://travis-ci.org/buttercup-pw/buttercup) [![Build status](https://ci.appveyor.com/api/projects/status/lmu0e4rf45j3ea6g/branch/master?svg=true)](https://ci.appveyor.com/project/sallar/buttercup/branch/master)
 [![Github All Releases](https://img.shields.io/github/downloads/buttercup-pw/buttercup/total.svg)](https://github.com/buttercup-pw/buttercup/releases) [![encryption](https://img.shields.io/badge/Encryption-AES%20256%20CBC-red.svg)](https://tools.ietf.org/html/rfc3602) [![Gitter](https://img.shields.io/gitter/room/buttercup-cpre/buttercup.svg)](https://gitter.im/buttercup-pw/buttercup)

![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/ff7ebf7e/screenshot/0.4.0.png)

## Under Development
Buttercup is currently under heavy development, and updates will be pushed here very frequently.
The application is currently in alpha, and should be considered unstable.

Please check [buttercup-core](https://github.com/perry-mitchell/buttercup-core) for more information on Buttercup’s core module.

## Download & Install
[Click here to automatically download](https://download.buttercup.pw) the latest release for your OS, or checkout the [releases page](https://github.com/buttercup-pw/buttercup/releases) to download different builds and versions.

## Encryption & Format
Buttercup uses a delta-system to manage archive changes and save conflicts. The archive, upon saving, is encrypted with AES 256bit CBC mode with a SHA256 HMAC. Encryption is performed once the password has been salted and prepared with PBKDF2 at 1000 iterations.

Because security with password storage is of the utmost importance, Buttercup will remain in alpha/beta release mode until some level of professional scrutiny has occurred. It is completely possible that security-related changes will occur, but this is inevitable and we handle every question and criticism with great care when it comes to the safety of using our software.

## Development
If you're interested in developing Buttercup:

### Install Dependencies & Run
``` bash
## Install
$ npm install 
# or 
$ yarn

## Run
$ npm run start
```

## Package & Release

### Install Dependencies
You will need some extra dependencies to build for different platforms on a single platform. Please refer to [this guide](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) and install required software for your platform. 

### Building libraries before releasing
```bash
$ npm run build
```

### Package
To package the app and make installers for all supported platforms:

``` bash
$ npm run release
```
This may take a while depending on how fast your computer is. All apps and installers will be in `app` directory.

To package only for the current platform:

``` bash
$ npm run release:current
```

Or for a specific platform: 
``` bash
$ npm run release:mac
$ npm run release:win
$ npm run release:linux
```

## Contributors
### Creation
 * Sallar ([@sallar](https://twitter.com/sallar))
 * Perry ([@perry_mitchell](https://twitter.com/perry_mitchell))

### Contributions
 * Mohammad Amiri (Brand & Identity) ([@pixelvisualize](https://twitter.com/pixelvisualize))
 * Arash Asghari (Brand & Identity) ([@_arashasghari](https://twitter.com/_arashasghari))

> We welcome contributions. Please read [Contribution Guide](CONTRIBUTING.md) before sending a PR.

## License
Released under [GNU/GPL Version 3](LICENSE)
