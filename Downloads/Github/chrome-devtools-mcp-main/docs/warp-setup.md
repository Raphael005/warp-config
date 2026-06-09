# Chrome DevTools MCP — Warp Setup Guide

This guide documents how to configure and test the Chrome DevTools MCP server inside [Warp](https://www.warp.dev/).

## Prerequisites

- [Node.js](https://nodejs.org/) LTS
- [Google Chrome](https://www.google.com/chrome/) (stable or newer)
- [Warp](https://www.warp.dev/) terminal

## Configuration

Warp reads MCP server definitions from `~/.warp/.mcp.json` (global) or `{repo_root}/.warp/.mcp.json` (project-scoped).

Add the following entry to `~/.warp/.mcp.json`, preserving any existing servers:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Warp auto-detects changes to `.mcp.json` on save — no restart required. The server will appear in **Settings → AI → Manage MCP Servers** labelled "Detected from Warp".

> **Note:** The MCP server starts Chrome automatically the first time a browser tool is invoked. It does not launch Chrome just from connecting.

### Optional flags

Pass additional flags via the `args` array. Common examples:

| Flag | Purpose |
|------|---------|
| `--headless` | Run Chrome without a visible window |
| `--isolated` | Use a temporary profile, cleaned up after the session |
| `--slim` | Expose only 3 tools: navigate, screenshot, script eval |
| `--no-usage-statistics` | Opt out of Google telemetry |
| `--browser-url=http://127.0.0.1:9222` | Connect to an already-running Chrome instance |

Example with options:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--headless",
        "--isolated",
        "--no-usage-statistics"
      ]
    }
  }
}
```

## Testing the Integration

### 1. Navigate to a page and take a screenshot

Ask Oz (Warp's AI agent) to navigate to a URL and capture a screenshot:

```
Navigate to https://example.com and take a screenshot.
```

Expected outcome: Chrome opens, loads the page, and Warp displays the screenshot inline.

### 2. Run a Lighthouse audit

```
Perform a Lighthouse audit on the current page.
```

Oz will invoke `lighthouse_audit` and return category scores for:

- **Accessibility**
- **Best Practices**
- **SEO**
- **Agentic Browsing**

Full JSON and HTML reports are written to a temporary directory and the paths are reported in the response.

### 3. Clean up

To reset the browser session and remove temp files:

```
Close the browser session and clean up any temporary files.
```

Oz will navigate the active tab to `about:blank` (the last open page cannot be closed via MCP) and delete any Lighthouse report directories.

## Troubleshooting

See the project's [troubleshooting guide](./troubleshooting.md) for general issues.

### Warp-specific tips

- If the server does not appear in Warp's MCP settings, verify the JSON in `~/.warp/.mcp.json` is valid and save the file again.
- If Chrome fails to launch, ensure a supported version of Chrome is installed and `npx` is available in your `PATH`.
- To view server logs, add `--log-file=/tmp/chrome-devtools-mcp.log` to `args` and set the `DEBUG=*` environment variable.
