<h1 align="center">
  <br/>
  <img src="https://cdn.rawgit.com/buttercup-pw/buttercup-assets/054fc0fa/badge/desktop.svg" alt="Buttercup Desktop">
  <br/>
  <br/>
  <br/>
</h1>

> Cross-platform, free and open-source password manager based on NodeJS.

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![Build Status](https://travis-ci.org/buttercup/buttercup-desktop.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-desktop) [![Build status](https://ci.appveyor.com/api/projects/status/tvthn0hnrsrr4ugy/branch/master?svg=true)](https://ci.appveyor.com/project/sallar/buttercup/branch/master) 
![Latest version](https://img.shields.io/github/tag/buttercup/buttercup-desktop.svg?label=latest) [![Github All Releases](https://buttercup-download-count.now.sh/?)](https://github.com/buttercup/buttercup-desktop/releases) [![Backers on Open Collective](https://opencollective.com/buttercup/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/buttercup/sponsors/badge.svg)](#sponsors) [![encryption](https://img.shields.io/badge/Encryption-AES%20256%20CBC-red.svg)](https://tools.ietf.org/html/rfc3602) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/buttercup)

![image](https://user-images.githubusercontent.com/3869469/35880367-6bd58770-0b86-11e8-879f-d1f9136274a9.png)

## About
Buttercup is a **password manager** - an assistant for helping you store all of your login credentials. Buttercup helps you keep your accounts safe and assists you when you want to log in - all you need to do is remember just one password: your **master password**.

This is the Desktop application in the Buttercup suite, and there's also a [mobile app](https://github.com/buttercup/buttercup-mobile) and [browser extension](https://github.com/buttercup/buttercup-browser-extension) so that you can access your credentials anywhere. You store your credentials (login information) in a secure archive, which can then be stored on your own computer or any of our supported **cloud services** (like Dropbox, for example).

Archives are encrypted using the AES specification, and cannot be read by anyone besides those with the master password. Brute-force decryption is not technically possible. You should not share your archive with anyone, but rest assured: your contents are safe.

### Why you need software like Buttercup
Many of us have 10s or 100s of accounts, and it would be _crazy_ to secure these with 1 or 2 passwords. Why? If an attacker gains access to one of the systems you have an account with, your password there may be easily stolen - if an attacker gets this it's highly likely they will try to log in to other accounts you have with the same password. If you're using the same password on more than one site, you risk having several accounts stolen if any one of them is breached.

Buttercup helps you by remembering all of your passwords, and because you no longer have to remember them yourself, you can use **different passwords for every single site**.

## Protecting your details

Buttercup provides a secure way of storing your details, but it is only as secure as how you treat your master password and archive files.

Ensure that you never share your master password or use it anywhere other than with your archive. Never share or store your archive in a non-private environment. Always remember to make **regular** backups of your archive.

## Download & Install

[Head over to our website](https://buttercup.pw), or checkout the [releases page](https://github.com/buttercup/buttercup-desktop/releases) to download different builds and versions.

If you're using macOS, you can also use **Homebrew Cask** to download and install Buttercup:

```shell
$ brew cask install buttercup
```

If you're using Windows, you can use [**Chocolatey**](https://chocolatey.org/) to download and install [Buttercup](https://chocolatey.org/packages/buttercup):

```shell
choco install buttercup
```

### Platforms and Operating Systems
Buttercup is available for **macOS (dmg)**, **Windows (exe)** and **Linux (deb, rpm, tarball)** (64bit only).

We actively support Buttercup on the following platforms:

 * MacOS (latest)
 * Windows 10
 * Ubuntu 18.04

Operating systems outside of these are not directly supported by staff - Issues will be followed on GitHub, however, and assistance provided where possible.

#### Arch Linux
Buttercup is also available for [Arch Linux (32/64bit) (AUR)](https://aur.archlinux.org/packages/buttercup-desktop/).

Some users have reported segmentation faults on Arch - if you notice a similiar issue, perhaps check out [this solution](https://github.com/buttercup/buttercup-desktop/issues/643).

### Portability

Buttercup supports portable builds on the following platforms:

 * Linux: [AppImage](https://github.com/buttercup/buttercup-desktop/releases/latest)

_Portable versions for Windows and Mac will arrive in the not-so-distant future._

## Encryption & Format

Buttercup uses a delta-system to manage archive changes and save conflicts. The archive, upon saving, is encrypted with AES 256bit CBC mode with a SHA256 HMAC. Encryption is performed once the password has been salted and prepared with PBKDF2 at between 200-250k iterations.

Because security with password storage is of the utmost importance, Buttercup will remain in alpha/beta release mode until some level of professional scrutiny has occurred. It is completely possible that security-related changes will occur, but this is inevitable and we handle every question and criticism with great care when it comes to the safety of using our software.

## Features

Buttercup supports loading and saving credentials archives both locally and remotely. Remote archives can be stored in a variety of service providers like Dropbox, ownCloud and Nextcloud (and others that support WebDAV, such as Yandex).

Archives store groups and entries in a simple hierarchy. Both groups and entries can be moved into other groups. Deleted items are trashed before being removed permanently.

Buttercup has basic merge conflict resolution when 2 changes are made at once on the file (locally or remote).

### WebDAV

Buttercup can connect to WebDAV-based services for the purpose of remotely-accessing vault files. Most WebDAV services and services supporting WebDAV are compatible.

Please note that Buttercup **does not support self-signed certificates**.

### Importing and Exporting
You can import from other password managers (such as 1Password, Lastpass and KeePass) by opening your archive and choosing Import from the menu.

You can also export Buttercup vaults to CSV format.

## Internationalization

Buttercup for Desktop supports the following languages:

 * **English** (Default)
 * Spanish
 * German
 * French
 * Russian
 * Farsi
 * Bahasa Indonesia
 * Italian
 * Brazilian Portuguese
 * Ukrainian
 * Hungarian
 * Czech
 * Dutch
 * Turkish
 * Polish
 * Finnish

### Submitting internationalization configurations

We welcome the addition of new languages to the Buttercup platform. Please follow the style of the current translations.

If adding languages that are more specific than usual (eg. "pt_br" - Brazilian Portuguese), ensure that you separate the parts by an underscore `_` and not a dash.

## Development

If you're interested in developing Buttercup:

### Install Dependencies & Run

``` bash
$ npm install
$ npm run start
```

## Package & Release

### Install Dependencies

You will need some extra dependencies to build for different platforms on a single platform. Please refer to [this guide](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) and install required software for your platform.

### Building libraries before releasing

``` bash
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
$ npm run package:current
```

Or for a specific platform:
``` bash
$ npm run package:mac
$ npm run package:win
$ npm run package:linux
```

## Debugging

In case you need to access Buttercup logs, they are located in:

* **On Linux:** `~/.config/Buttercup/log.log`
* **On macOS:** `~/Library/Logs/Buttercup/log.log`
* **On Windows:** `%USERPROFILE%\AppData\Roaming\Buttercup\log.log`

## Contributors

### Creation

 * Sallar ([@sallar](https://twitter.com/sallar))
 * Perry ([@perry_mitchell](https://twitter.com/perry_mitchell))

### Contributions

This project exists thanks to all the people who contribute. [[Contribute]](CONTRIBUTING.md).
<a href="https://github.com/buttercup/buttercup-desktop/graphs/contributors"><img src="https://opencollective.com/buttercup/contributors.svg?width=890" /></a>

We'd also like to thank:

 * Mohammad Amiri (Brand & Identity) ([@pixelvisualize](https://twitter.com/pixelvisualize))
 * Arash Asghari (Brand & Identity) ([@_arashasghari](https://twitter.com/_arashasghari))

> We welcome contributions. Please read [Contribution Guide](CONTRIBUTING.md) before sending a PR.

### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/buttercup#backer)]

<a href="https://opencollective.com/buttercup#backers" target="_blank"><img src="https://opencollective.com/buttercup/backers.svg?width=890"></a>

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/buttercup#sponsor)]

<a href="https://opencollective.com/buttercup/sponsor/0/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/1/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/2/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/3/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/4/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/5/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/6/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/7/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/8/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/9/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/9/avatar.svg"></a>

## License

Released under [GNU/GPL Version 3](LICENSE)
