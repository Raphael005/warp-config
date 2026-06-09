# com.add0n.native_client — Native Messaging Host

A Node.js-based native messaging host that bridges browser extensions (for tools like Send to VLC, Download with IDM/FDM/JDownloader, Edit with Sublime Text/VIM, etc.) to the local macOS system.

## Requirements

- macOS
- Node.js v6+ (the installer will fall back to a bundled Node binary if none is found)

## Installation

1. Ensure `install.sh` is executable:

```bash
chmod +x install.sh
```

2. Run the installer:

```bash
./install.sh
```

The installer will:
- Detect your system Node.js (or use the bundled binary as a fallback)
- Copy the native host app to `~/.config/com.add0n.native_client/`
- Register the native messaging manifest (`com.add0n.native_client.json`) for all supported browsers

### Supported Browsers

| Browser | Manifest location |
|---|---|
| Google Chrome | `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/` |
| Chromium | `~/Library/Application Support/Chromium/NativeMessagingHosts/` |
| Vivaldi | `~/Library/Application Support/Vivaldi/NativeMessagingHosts/` |
| Brave | `~/Library/Application Support/BraveSoftware/Brave-Browser/NativeMessagingHosts/` |
| Microsoft Edge | `~/Library/Application Support/Microsoft Edge/NativeMessagingHosts/` |
| Firefox | `~/Library/Application Support/Mozilla/NativeMessagingHosts/` |
| Waterfox | `~/Library/Application Support/Waterfox/NativeMessagingHosts/` |
| Tor Browser | `~/Library/Application Support/TorBrowser-Data/Browser/Mozilla/NativeMessagingHosts/` |
| Thunderbird | `~/Library/Application Support/Thunderbird/NativeMessagingHosts/` |

## Installed Files

After installation, the following files are placed in `~/.config/com.add0n.native_client/`:

| File | Description |
|---|---|
| `host.js` | Main native messaging host entry point |
| `messaging.js` | Stdio-based native messaging protocol handler |
| `config.js` | Host ID, version, and allowed extension IDs |
| `run.sh` | Shell wrapper invoked by the browser via the manifest |

## Verification

### 1. Check manifest files exist

```bash
# Chrome
ls ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/com.add0n.native_client.json

# Firefox
ls ~/Library/Application\ Support/Mozilla/NativeMessagingHosts/com.add0n.native_client.json

# Native host directory
ls ~/.config/com.add0n.native_client/
```

### 2. Verify Node.js runtime

```bash
# Confirm the Node binary referenced in run.sh is accessible
$(grep -o '[^ ]*node' ~/.config/com.add0n.native_client/run.sh) --version
```

### 3. Syntax-check the host scripts

```bash
NODE=$(grep -o '[^ ]*node' ~/.config/com.add0n.native_client/run.sh)
$NODE --check ~/.config/com.add0n.native_client/host.js && echo "host.js OK"
$NODE --check ~/.config/com.add0n.native_client/messaging.js && echo "messaging.js OK"
$NODE -e "require(process.env.HOME + '/.config/com.add0n.native_client/config.js'); console.log('config.js OK')"
```

### 4. Confirm run.sh is executable

```bash
ls -la ~/.config/com.add0n.native_client/run.sh
# Should show -rwxr-xr-x
```

### 5. End-to-end browser test

Install one of the supported browser extensions (e.g. [Send to VLC](https://chrome.google.com/webstore/detail/send-to-vlc/hfckgfbhdacemicpjljhfbjmkiggeche)) and trigger an action that invokes the native host. A successful response from the extension confirms the full messaging pipeline is working.

## How It Works

Browsers communicate with native applications via the [Native Messaging API](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging). When a permitted extension sends a message:

1. The browser looks up `com.add0n.native_client.json` in the platform's native messaging hosts directory.
2. The manifest points to `run.sh`, which the browser spawns as a subprocess.
3. `run.sh` starts `host.js` via Node.js.
4. Messages are exchanged over stdin/stdout using a 4-byte little-endian length prefix followed by a JSON payload.

## Version

Native host version: **0.4.7**
