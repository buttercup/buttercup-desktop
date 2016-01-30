# Buttercup
Cross-platform, free and open-source password manager based on NodeJS.

[![Build Status](https://travis-ci.org/buttercup-pw/buttercup.svg?branch=master)](https://travis-ci.org/buttercup-pw/buttercup)

## Under Development
Buttercup is currently under heavy development, and updates will be pushed here very frequently.
The application is currently in alpha, and should be considered unstable.

Please check [buttercup-core](https://github.com/perry-mitchell/buttercup-core) for more information on Buttercup’s core module.

## Installing
You can install a release of Buttercup by checking out the [releases page](https://github.com/buttercup-pw/buttercup/releases).

## Setup & Usage
### Install Dependencies
``` bash
$ npm install -g electron-prebuilt jspm
$ npm install
```

### Build and Run
``` bash
$ grunt build
$ electron .
```

### Watch while development
```bash
$ grunt watch
```

### Required software
You will need the following things to build the project executables and installers:
 * NSIS (makensis in homebrew)
 * dpkg
 * wine

## Contributors
### Creation
 * Sallar ([@sallar](https://twitter.com/sallar))
 * Perry ([@perry_mitchell](https://twitter.com/perry_mitchell))

### Contributions
 * Mohammad Amiri (logo) ([@pixelvisualize](https://twitter.com/pixelvisualize))
