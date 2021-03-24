# Buttercup Desktop
> Buttercup for Desktop - Mac, Linux and Windows

**:warning: This is a Work-in-Progress! It will soon be in beta release mode. Please do not submit any issues or PRs regarding this project until this notice is removed.**

## Configuration

Configuration files are stored in OS-specific locations.

### App config

Application configuration.

 * Linux: `$XDG_CONFIG_HOME/Buttercup/desktop.config.json`
 * Mac: `~/Library/Preferences/Buttercup/desktop.config.json`
 * Windows: `$APPDATA/Buttercup/Config/desktop.config.json`

### Vault storage

Storage of connected vaults (not actual vault contents).

 * Linux: `$XDG_DATA_HOME/Buttercup/vaults.json`
 * Mac: `~/Library/Application\ Support/Buttercup/vaults.json`
 * Windows: `$LOCALAPPDATA/Buttercup/Data/vaults.json`

### Offline vault cache

Stored copies of vaults for offline use.

 * Linux: `$(node -e "console.log(os.tmpdir())")/$(whoami)/Buttercup/vaults-offline.cache.json`
 * Mac: `$(node -e "console.log(os.tmpdir())")/Buttercup/vaults-offline.cache.json`
 * Windows: `$(node -e "console.log(os.tmpdir())")/Buttercup/vaults-offline.cache.json`

### Logs

Logs are written for all app sessions.

 * Linux: `~/.local/state/Buttercup-nodejs` or `$XDG_STATE_HOME/Buttercup-nodejs`
 * Mac: `~/Library/Logs/Buttercup-nodejs`
 * Windows: `%LOCALAPPDATA%\Buttercup-nodejs\Log`

## Published Applications

You can view the current releases on the [Buttercup Desktop releases page](https://github.com/buttercup/buttercup-desktop/releases). Under each release are some assets - the various binaries and installers for each platform Buttercup supports. When installing or downloading, make sure to pick the right operating system and architecture for your machine.

_Note that at this time, Buttercup only supports x64 (64 bit) machines._

### Linux

We provide an **AppImage** build for Linux, because it is the most desirable format for us to release. AppImages support auto-updating, a crucial feature (we feel) for a security application. The other build types do not.

We won't be supporting formats like Snapcraft, deb or rpm images as they do not align with our requirements. Issues requesting these formats will be closed immediately. Discussion on topics like this should be started on other social channels.
