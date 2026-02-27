# Benote SSO (Single Sign-On) Module

A secure SSO module for Benote that supports token handoff to external platforms using a JWT POST-binding flow.

## Architecture Flow

1. The frontend requests an SSO token from the Benote backend.
2. The backend generates a short-lived JWT scoped to a target audience.
3. The frontend submits that token to the external platform using a hidden POST form.

## Package Parts

| Package | Purpose | Technology |
| :--- | :--- | :--- |
| `backend` | JWT generation, signing, and claims shaping. | Node.js / JWT |
| `frontend` | Token fetch and automatic POST submission. | React / JavaScript |

## Backend Usage (`@benote/sso-backend`)

```javascript
// backend/routes/authRoutes.js
router.post("/sso/external", authMiddleware.authMiddleware, async (req, res) => {
  const user = req.user;
  const secret = process.env.SSO_SHARED_SECRET;
  const audience = "external-platform";

  const token = ssoService.generateToken(user, [], audience, secret);
  res.json({ token });
});
```

## Frontend Usage (`@benote/sso-frontend`)

```javascript
import { useSSO } from "@benote/sso-frontend";

export const triggerExternalSSO = async (apiEndpoint, targetBaseUrl, authToken) => {
  const { triggerSSO } = useSSO();
  await triggerSSO(apiEndpoint, targetBaseUrl, authToken, {
    allowedTargetOrigins: [new URL(targetBaseUrl).origin],
  });
};
```

## External Platform Callback Example

```python
import jwt  # pip install PyJWT

def sso_callback(post):
    token = post.get("access_token")
    secret = "YOUR_SHARED_SECRET_KEY"

    payload = jwt.decode(
        token,
        secret,
        audience="external-platform",
        algorithms=["HS256"]
    )

    # Use payload["email"] or payload["sub"] to identify the user
    return payload
```

## Security Defaults

1. Keep signing secrets in secure environment variables.
2. Use HTTPS for all environments beyond local development.
3. Tokens are short-lived by default (`SSO_TOKEN_TTL_SECONDS`, default `300`).
4. Always verify `aud`, `iss`, `exp`, and signature on the receiver side.

## Configuration

| Env Variable | Role | Required |
| :--- | :--- | :--- |
| `SSO_SHARED_SECRET` | Backend signing secret | Yes |
| `SSO_TOKEN_TTL_SECONDS` | Token TTL in seconds | No |
| `API_URL` | Benote API root | Yes |
