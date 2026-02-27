# @benote/sso-backend

This package provides backend logic for generating secure SSO tokens for Benote integrations with external platforms.

## Installation

```bash
npm install @benote/sso-backend
```

## Usage

```javascript
// backend/routes/authRoutes.js
const ssoService = require('@benote/sso-backend');

router.post('/sso/external', authMiddleware.authMiddleware, async (req, res) => {
  const user = req.user;
  const secret = process.env.SSO_SHARED_SECRET;
  const audience = 'external-platform';

  const token = ssoService.generateToken(user, [], audience, secret);
  res.json({ token });
})
```

### API Reference

#### `ssoService.generateToken(user, accessControls, audience, secret, issuer)`

Generates a signed JWT for external system SSO.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `user` | `Object` | The user object containing `id` (or `sub`), `email`, `name`, `role`. |
| `accessControls` | `Array` | Array of access control objects or strings representing roles/permissions. |
| `audience` | `string` | The target system identifier (e.g., `'external-platform'`). |
| `secret` | `string` | Secret key for signing the token. |
| `issuer` | `string` | (Optional) Issuer identifier. Defaults to 'benote-auth'. |
| `options` | `Object` | (Optional) Token options such as `expiresIn`. |

**Returns:** `string` (Signed JWT token, short-lived by default).
