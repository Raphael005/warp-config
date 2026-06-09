# Microraffi

> **Status:** v0.0.1 — Early development, active work in progress.

Microraffi is a Progressive Web App (PWA) built with [Lit](https://lit.dev), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/). It includes a client-side router, a service worker via [Workbox](https://developer.chrome.com/docs/workbox/), and UI components from [Shoelace](https://shoelace.style/).

## Tech Stack

- **[Lit](https://lit.dev)** — Web components framework
- **[TypeScript](https://www.typescriptlang.org/)** — Strict mode, ESNext target
- **[Vite](https://vitejs.dev/)** — Build tool and dev server
- **[Shoelace](https://shoelace.style/)** — UI component library
- **[App Tools Router](https://github.com/thepassle/app-tools/blob/master/router/README.md)** — Client-side routing
- **[Workbox](https://developer.chrome.com/docs/workbox/)** — Service worker & precaching

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/Microraffi.git
cd Microraffi
npm install
```

## Development

Start the local dev server (opens in browser automatically):

```bash
npm start
```

Or without auto-opening:

```bash
npm run dev-task
```

To expose the dev server on your local network:

```bash
npm run start-remote
```

## Build

Compile TypeScript and bundle for production:

```bash
npm run build
```

Output is written to the `dist/` directory.

## Deploy

Deploy to [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static):

```bash
npm run deploy
```

## Project Structure

```
src/
  app-index.ts       # Root component
  router.ts          # Client-side route definitions
  components/        # Shared components (e.g. header)
  pages/             # Page components (app-home, app-about)
  styles/            # Global and shared styles
public/              # Static assets
index.html           # App entry point
```
