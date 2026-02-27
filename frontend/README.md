# @benote/sso-frontend

Framework-agnostic frontend utilities for SSO handoff.

## Installation

```bash
npm install @benote/sso-frontend
```

## Tests

```bash
npm test
```

Test files live in `frontend/tests`.

## Works In

- Plain browser JavaScript
- React, Vue, Angular, Svelte
- Bundlers and runtimes using either ESM (`import`) or CommonJS (`require`)

## API

### `triggerSSO(apiEndpoint, targetBaseUrl, authToken, options?)`

Fetches an SSO token from your backend and submits it to `${targetBaseUrl}/auth/sso/callback` via hidden form POST.

### `createSSOClient(defaults?)`

Creates a reusable client with defaults (`apiEndpoint`, `targetBaseUrl`, `authToken`, `options`).

### `useSSO()`

Compatibility helper that returns `{ triggerSSO }`. This is not React-specific and can be used anywhere.

## ESM Usage

```javascript
import { triggerSSO, createSSOClient } from "@benote/sso-frontend";

await triggerSSO(apiEndpoint, targetBaseUrl, authToken, {
  allowedTargetOrigins: [new URL(targetBaseUrl).origin],
});

const sso = createSSOClient({
  apiEndpoint,
  targetBaseUrl,
  options: { timeoutMs: 10000 },
});
await sso.triggerSSO(undefined, undefined, authToken);
```

## CommonJS Usage

```javascript
const { triggerSSO } = require("@benote/sso-frontend");

await triggerSSO(apiEndpoint, targetBaseUrl, authToken);
```
