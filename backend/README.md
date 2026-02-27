# @benote/sso-backend

Backend SSO token generation for any JavaScript project.

## Installation

```bash
npm install @benote/sso-backend
```

## Tests

```bash
npm test
```

Test files live in `backend/tests`.

## CommonJS Usage

```javascript
const ssoService = require("@benote/sso-backend");

const token = ssoService.generateToken(
  user,
  accessControls,
  "external-platform",
  process.env.SSO_SHARED_SECRET
);
```

## ESM Usage

```javascript
import ssoService, { generateToken } from "@benote/sso-backend";

const tokenA = ssoService.generateToken(user, [], "external-platform", secret);
const tokenB = generateToken(user, [], "external-platform", secret);
```

## API

### `generateToken(user, accessControls, audience, secret, issuer?, options?)`

- Validates required input (`user`, `audience`, `secret`, `user.id/sub`)
- Signs HS256 JWT with issuer/audience/subject
- Adds `jti` and short TTL by default

`options` supports `expiresIn` and overrides default TTL behavior.
