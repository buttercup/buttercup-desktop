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
