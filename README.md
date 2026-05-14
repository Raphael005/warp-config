# raphael

An IINA plugin project written in TypeScript.

## Development

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

Tests are powered by [Vitest](https://vitest.dev/) and live in `src/**/*.test.ts`.

---

## Release Workflow

This repository uses a `main` → `production` promotion model. Branch protection rules are not available on the current plan, so the following workflow should be followed manually.

### Branches

- `main` — active development; all feature branches are merged here via pull request
- `production` — stable releases only; never commit or push directly to this branch

### Promoting a release to production

1. Ensure `main` is stable and all tests pass:
   ```bash
   npm run build && npm run test
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

## Python Data Models

Located in `models.py`. Generated from a JSON schema using [`datamodel-codegen`](https://koxudaxi.github.io/datamodel-code-generator/) v0.45.0 and validated with [Pydantic v2](https://docs.pydantic.dev/latest/).

### Prerequisites

```bash
pip install 'pydantic[email]'
```

### Models

#### `Address`

Represents a physical address.

| Field | Type | Required |
|-------|------|----------|
| `street` | `str` | Yes |
| `city` | `str` | Yes |
| `zip_code` | `str` | No |

#### `User`

Represents a user with an optional nested address.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `id` | `int` | Yes | — |
| `name` | `str` | Yes | — |
| `email` | `EmailStr` | Yes | Valid email format |
| `age` | `int` | No | 0–150 |
| `address` | `Address` | No | — |
| `tags` | `list[str]` | No | — |

### Usage

```python
from models import Address, User

user = User(
    id=1,
    name="Alice",
    email="alice@example.com",
    age=30,
    address=Address(street="123 Main St", city="Springfield", zip_code="12345"),
    tags=["admin"],
)
print(user.model_dump())
```

### Regenerating models

If the schema changes, regenerate `models.py` with:

```bash
datamodel-codegen \
  --input schema.json \
  --input-file-type jsonschema \
  --output models.py \
  --output-model-type pydantic_v2.BaseModel
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
