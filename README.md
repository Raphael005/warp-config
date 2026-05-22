# raphael

An IINA plugin project written in TypeScript.

## Development

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
microraffi install
```

### Build

```bash
microraffi run build
```

### Test

```bash
microraffi run test
```

Tests are powered by [Vitest](https://vitest.dev/) and live in `src/**/*.test.ts`.

---

## Environment Setup

This project relies on two external tools that must be installed before development.

### Vite+ Toolchain

Vite+ is the unified build toolchain used by this project. It also manages Node.js versions via shims.

**Install:**

```bash
curl -fsSL https://vite.plus | bash
```

The installer will:
1. Ask whether to enable Node.js version management (recommended — adds `node`, `npm`, `npx` shims to `~/.vite-plus/bin/`).
2. Update shell config files (`~/.zshenv`, `~/.zshrc`, `~/.profile`).
3. Print a summary of available commands (`vp create`, `vp env`, `vp install`, `vp migrate`).

**Note:** Restart your terminal (or `source ~/.zshenv && source ~/.zshrc`) after installation to load the updated PATH.

**Verify:**

```bash
vp env doctor
```

Expected output:

```
VITE+ - The Unified Toolchain for the Web

Installation
  ✓ VP_HOME           ~/.vite-plus
  ✓ Bin directory     exists
  ✓ Shims             node, npm, npx, vpx, vpr

Configuration
  ✓ Node.js mode      managed
  ✓ IDE integration   env sourced in ~/.zshenv

PATH
  ✓ vp                in PATH
  ✓ node              ~/.vite-plus/bin/node (vp shim)
  ✓ npm               ~/.vite-plus/bin/npm (vp shim)
  ✓ npx               ~/.vite-plus/bin/npx (vp shim)

Version Resolution
  Source            lts
  Version           24.16.0
  ✓ Node binary       installed

✓ All checks passed
```

To opt out of Node.js version management at any time: `vp env off`.

### Native Messaging Host (`emano.waldeck`)

Required for browser extension ↔ local system communication. Registers a native messaging manifest with Chrome, Chromium, Vivaldi, and Firefox.

**Install:**

```bash
bash ~/Downloads/mac/install.sh
```

The installer will:
1. Detect and use the system Node.js (v6+ required).
2. Create `~/.config/emano.waldeck/` and copy the host files there.
3. Register `emano.waldeck.json` in each supported browser's `NativeMessagingHosts` directory.

Expected output:

```
 -> Root directory is /Users/<you>/.config
 -> Creating a directory at .../Google/Chrome/NativeMessagingHosts
 -> Chrome Browser is supported
 -> Creating a directory at .../Chromium/NativeMessagingHosts
 -> Chromium Browser is supported
 -> Creating a directory at .../Vivaldi/NativeMessagingHosts
 -> Vivaldi Browser is supported
 -> Creating a directory at .../Mozilla/NativeMessagingHosts
 -> Firefox Browser is supported
 -> Native Host is installed in /Users/<you>/.config/emano.waldeck

>>> Application is ready to use <<<
```

**Verify:**

```bash
node ~/.config/emano.waldeck/test.js
```

Expected output:

```
native-messaging end-to-end tests

  ✓  spec request returns version and platform
  ✓  script execution: arithmetic result
  ✓  script execution: args forwarded into sandbox
  ✓  script execution: version available in sandbox
  ✓  script execution: require denied without permission
  ✓  script execution: require granted with permission
  ✓  missing script key returns error response
  ✓  script execution: multiple push() calls return multiple frames

8/8 tests passed
```

---

## Release Workflow

This repository uses a `main` → `production` promotion model. Branch protection rules are not available on the current plan, so the following workflow should be followed manually.

### Branches

- `main` — active development; all feature branches are merged here via pull request
- `production` — stable releases only; never commit or push directly to this branch

### Promoting a release to production

1. Ensure `main` is stable and all tests pass:
   ```bash
   microraffi run build && microraffi run test
   ```
2. Create and push a version tag on `main`:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```
3. Open a pull request from `main` → `production` on GitHub and request a review.
4. Merge only after approval — use **squash merge** to keep a linear history.
5. Never force-push or push commits directly to `production`.

---

## Progressive Web App (PWA)

The project includes a full PWA implementation built with [Vite](https://vitejs.dev/) and [@pwabuilder/pwainstall](https://github.com/pwa-builder/pwa-install).

### Architecture

| File | Purpose |
|---|---|
| `index.html` | Entry point — manifest link, iOS meta tags, module script |
| `manifest.json` | Web app manifest (name, icons, display mode, theme color) |
| `sw.js` | Service worker — cache-first (assets) + network-first (HTML/API) |
| `src/pwa-entry.ts` | TS entry — imports pwainstall locally, registers SW |
| `vite.config.ts` | Vite build config — Oxc minification, outputs to `dist/pwa/` |
| `icons/` | Pre-generated placeholder icons (72px–512px + maskable) |

### Prerequisites

- Node.js ≥ 18
- Google Chrome (required by the Lighthouse audit script)
- HTTPS in production (localhost is exempt during development)

### Build

Produces a minified, self-contained build in `dist/pwa/`:

```bash
npm run build:pwa
```

Post-build, `dist/pwa/` contains:

```
dist/pwa/
├── index.html          # rewritten with hashed asset references
├── sw.js               # service worker (fixed path, unmodified)
├── manifest.json       # web app manifest (fixed path, for pwa-install component)
├── icons/              # all icon sizes (fixed paths, referenced by manifest)
└── assets/
    ├── index-[hash].js           # minified JS bundle (~35 kB, ~11 kB gzipped)
    └── manifest-[hash].json      # hashed manifest (referenced by <link rel="manifest">)
```

### Local preview

Preview the production build locally:

```bash
npm run preview:pwa
```

### Replacing placeholder icons

The `icons/` directory contains solid-color placeholders. To generate real icons from a source image, install `sharp` and run the generator:

```bash
npm install sharp fs-extra
node tools/generate-icons.js path/to/logo.png
```

This produces all 8 standard sizes (72–512px) plus a maskable 512px variant with a 10% safe-zone. Replace `theme_color` in `manifest.json` and the `background` value in `generate-icons.js` to match your brand.

### Service worker caching strategy

| Request type | Strategy | Rationale |
|---|---|---|
| HTML documents | Network-first | Always serve fresh pages; fall back to cache offline |
| JS / CSS / images / fonts | Cache-first | Fast loads; update cache on miss |
| Everything else | Network-first | API calls and dynamic content need fresh data |

To force a cache bust on next deploy, bump `CACHE_NAME` in `sw.js` (e.g. `my-pwa-v1` → `my-pwa-v2`). The `activate` handler automatically purges the old cache.

### Auditing

Run the Lighthouse audit script against any URL:

```bash
chmod +x tools/audit-pwa.sh
./tools/audit-pwa.sh http://localhost:3000
./tools/audit-pwa.sh https://your-domain.com
```

Timestamped HTML and JSON reports are saved to `lighthouse-reports/`.

Run the full smoke test suite (32 checks covering assets, manifest, SW, bundle hygiene, and Lighthouse scores):

```bash
# Start a server first, then:
node tools/smoke-test-pwa.js
```

### Production checklist

- Serve over **HTTPS** (required for install prompt and service workers)
- Enable **gzip/brotli compression** on your server for JS and JSON assets
- Set **`Cache-Control`** headers: long TTL for hashed assets, short/no-cache for `sw.js` and `manifest.json`
- Replace placeholder icons with real artwork
- Update `name`, `short_name`, `description`, and `theme_color` in `manifest.json`
- Add real `screenshots` to `manifest.json` for a richer install dialog on Chrome

---

## Lit Web Components

The project uses [Lit](https://lit.dev/) for building lightweight, standards-based web components.

### Installation

```bash
microraffi install
```

Lit is listed as a dependency in `package.json` and is installed automatically.

### Component: `<my-element>`

Defined in `my-element.ts`. A simple `LitElement` that renders a greeting with a reactive `name` property.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `"World"` | The name to greet |

#### Usage in HTML

```html
<my-element name="Lit"></my-element>
```

Outputs: **Hello, Lit!**

### Browser demo

Open `lit-demo.html` directly in a browser to see two instances of `<my-element>` rendered side by side. It imports Lit from the `esm.sh` CDN — no build step required:

```bash
open lit-demo.html
```

---

## Python Data Models

Located in `models.py`. Generated from `forge-project/openapi.json` (OpenAPI 3.0) using [`datamodel-codegen`](https://koxudaxi.github.io/datamodel-code-generator/) and validated with [Pydantic v2](https://docs.pydantic.dev/latest/).

### Prerequisites

```bash
pip3 install pydantic
```

### Models

#### `Status`

Enum representing pet availability.

- `available`
- `pending`
- `sold`

#### `Pet`

Represents an existing pet (includes server-assigned `id`).

| Field | Type | Required |
|-------|------|----------|
| `id` | `int` | Yes |
| `name` | `str` | Yes |
| `tag` | `str` | No |
| `status` | `Status` | No |

#### `NewPet`

Payload for creating a new pet (no `id` required).

| Field | Type | Required |
|-------|------|----------|
| `name` | `str` | Yes |
| `tag` | `str` | No |
| `status` | `Status` | No |

### Usage

```python
from models import Pet, NewPet, Status

pet = Pet(id=1, name="Fido", tag="dog", status=Status.available)
new_pet = NewPet(name="Whiskers", status=Status.pending)
print(pet.model_dump())
```

### Tests

Run `test_models.py` to verify all models instantiate correctly:

```bash
python3 test_models.py
```

### Regenerating models

If the schema changes, regenerate `models.py` with:

```bash
datamodel-codegen \
  --input forge-project/openapi.json \
  --input-file-type openapi \
  --output models.py
```

---

## Utility Functions

Located in `src/utils.ts` and re-exported from `src/index.ts`.

### `clamp(value, min, max): number`

Clamps a number between a minimum and maximum value.

```ts
clamp(15, 0, 10)  // → 10
clamp(-5, 0, 10)  // → 0
clamp(5, 0, 10)   // → 5
```

### `formatDuration(seconds): string`

Formats a duration in seconds into a human-readable `MM:SS` or `HH:MM:SS` string. Returns `"0:00"` for negative or non-finite input.

```ts
formatDuration(45)    // → "0:45"
formatDuration(125)   // → "2:05"
formatDuration(3661)  // → "1:01:01"
```

### `parseVolume(input): number | null`

Parses a volume string (e.g. `"75%"`) into a normalized float between `0` and `1`. Returns `null` for invalid input. Values above `100%` are clamped to `1`.

```ts
parseVolume("75%")   // → 0.75
parseVolume("100%")  // → 1
parseVolume("abc")   // → null
```

### `isSupportedVideoFormat(filename): boolean`

Returns `true` if the filename has a supported video extension (`mp4`, `mkv`, `avi`, `mov`, `webm`, `flv`, `m4v`). Case-insensitive.

```ts
isSupportedVideoFormat("movie.mp4")    // → true
isSupportedVideoFormat("clip.MKV")     // → true
isSupportedVideoFormat("audio.mp3")    // → false
```
