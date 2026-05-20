# warp-config

TypeScript project configuration for IINA plugin development.

## Building

```bash
npm run build
```

Output is emitted to the `dist/` directory.

## TypeScript Configuration

The project uses the following `tsconfig.json` settings:

| Option | Value | Notes |
|---|---|---|
| `target` | `ES2017` | Output syntax level |
| `lib` | `ESNext`, `DOM`, `WebWorker` | Type definitions included |
| `module` | `ESNext` | Output module format |
| `moduleResolution` | `Bundler` | See note below |
| `resolveJsonModule` | `true` | Allows importing `.json` files |
| `strict` | `true` | Enables all strict type checks |
| `strictNullChecks` | `true` | Explicit null/undefined handling |
| `noUnusedLocals` | `true` | Errors on unused local variables |
| `esModuleInterop` | `true` | CommonJS/ESM interop helpers |

### moduleResolution: "Bundler"

`moduleResolution: "Node"` (also known as `Node10`) was deprecated in TypeScript 6.0 and is scheduled for removal in TypeScript 7.0. For projects using `module: "ESNext"`, the recommended replacement is `"Bundler"`, which:

- Supports `exports` and `imports` fields in `package.json`
- Allows extensionless imports (consistent with bundler behavior)
- Is the correct pairing for `module: "ESNext"` in modern toolchains

See the [TypeScript 6.0 migration guide](https://aka.ms/ts6) for more details.
