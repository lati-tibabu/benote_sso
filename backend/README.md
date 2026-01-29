# @benote/sso-backend

This package provides the backend logic for generating secure SSO tokens for the Benote ecosystem, intended for use with external integrations like OpenERP/Odoo.

## Installation

```bash
npm install @benote/sso-backend
```

## Usage

```javascript
const ssoService = require('@benote/sso-backend');

// Example usage in an express route
app.post('/api/auth/sso/odoo', async (req, res) => {
  const user = req.user; // Get user from session/context
  const secret = process.env.SSO_SECRET_KEY;
  const audience = 'odoo';

  const token = ssoService.generateToken(user, user.permissions, audience, secret);
  
  res.json({ token });
});
```

### API Reference

#### `ssoService.generateToken(user, accessControls, audience, secret, issuer)`

Generates a signed JWT for external system SSO.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `user` | `Object` | The user object containing `id` (or `sub`), `email`, `name`, `role`. |
| `accessControls` | `Array` | Array of access control objects or strings representing roles/permissions. |
| `audience` | `string` | The target system identifier (e.g., 'odoo'). |
| `secret` | `string` | Secret key for signing the token. |
| `issuer` | `string` | (Optional) Issuer identifier. Defaults to 'benote-auth'. |

**Returns:** `string` (Signed JWT token valid for 24h).
