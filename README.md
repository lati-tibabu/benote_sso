# 🚀 Benote SSO (Single Sign-On) Module

A robust, enterprise-grade SSO solution for the Benote ecosystem. This module enables seamless, secure authentication from Benote to external platforms like **Odoo (OpenERP)**, **Moodle**, or custom third-party services using a **JWT POST-Binding** flow.

---

## 🏗️ Architecture Flow

The SSO process follows the "POST Binding" pattern to ensure high security and avoid sensitive tokens appearing in browser history.

1.  **Request**: User clicks "Open ERP" in the Benote Frontend.
2.  **Token Generation**: Benote Frontend calls your custom `/api/auth/sso/odoo` endpoint.
3.  **Signing**: Benote Backend uses `@benote/sso-backend` to sign a JWT with user identity and permissions.
4.  **Delivery**: The Frontend receives the token and uses `@benote/sso-frontend` to dynamically generate a hidden form.
5.  **Handshake**: The form automatically POSTs the token to the external service (e.g., Odoo).
6.  **Login**: The external service validates the signature and establishes a session.

---

## 📦 Package Parts

| Package | Purpose | Technology |
| :--- | :--- | :--- |
| `backend` | Handles JWT generation, signing, and permission mapping. | Node.js / JWT |
| `frontend` | Handles API calls and automatic POST submission. | React / JavaScript |

---

## 🛠️ Backend Implementation (`@benote/sso-backend`)

### 1. Installation
```bash
npm install @benote/sso-backend
```

### 2. Implementation Guide
Create a route that acts as the "Token Issuer".

```javascript
// routes/auth.js
const express = require("express");
const router = express.Router();
const ssoService = require("@benote/sso-backend");
const { authMiddleware } = require("../middlewares/auth");

router.post("/sso/odoo", authMiddleware, async (req, res) => {
  try {
    /**
     * @param {Object} user - User model (id, email, name, role)
     * @param {Array} accessRights - Array of permission names
     * @param {string} audience - Target system ID (usually 'odoo')
     * @param {string} secret - Shared secret key
     */
    const token = ssoService.generateToken(
      req.user,
      req.user.accessControls, // e.g., ['inventory.read', 'sales.all']
      "odoo",
      process.env.SSO_SHARED_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Could not generate SSO token" });
  }
});
```

---

## 💻 Frontend Implementation (`@benote/sso-frontend`)

### 1. Installation
```bash
npm install @benote/sso-frontend
```

### 2. Integration in Components
Use the `useSSO` hook to trigger the redirect automatically.

```javascript
import { useSSO } from "@benote/sso-frontend";

const AppSidebar = () => {
  const { triggerSSO } = useSSO();
  const token = localStorage.getItem("token"); // Current Benote Auth Token

  const handleOpenERP = async () => {
    // 1. Benote Endpoint, 2. Odoo Base URL, 3. Auth Token
    await triggerSSO(
      "https://api.benote.com/api/auth/sso/odoo", 
      "https://erp.company.com", 
      token
    );
  };

  return <button onClick={handleOpenERP}>Launch Odoo</button>;
};
```

---

## 🐍 External Integration (The Odoo Side)

To complete the link, your Odoo instance needs a controller to receive the POST request.

**Example Python (Odoo Controller):**
```python
import jwt # pip install PyJWT
from odoo import http
from odoo.http import request

class BenoteSSOCallback(http.Controller):
    @http.route('/auth/sso/callback', type='http', auth='none', methods=['POST'], csrf=False)
    def sso_callback(self, **post):
        token = post.get('access_token')
        secret = "YOUR_SHARED_SECRET_KEY"
        
        try:
            # Decode and verify the Benote Signature
            payload = jwt.decode(token, secret, audience='odoo', algorithms=['HS256'])
            email = payload.get('email')
            
            # Authenticate user in Odoo
            user = request.env['res.users'].sudo().search([('login', '=', email)], limit=1)
            if user:
                request.session.authenticate(request.db, user.login, None)
                return http.redirect_with_hash('/web')
        except Exception:
            return "Invalid SSO Token."
```

---

## 🛡️ Security Best Practices

1.  **Shared Secret**: Keep `SSO_SHARED_SECRET` in your `.env` files. NEVER hardcode it. Better yet, use a Vault/KMS.
2.  **HTTPS**: This module requires HTTPS in production. The token is transmitted via POST, but it is still visible to the client's browser.
3.  **Token Expiry**: By default, the SSO token expires in **24 hours**. For high-security environments, modify the `expiresIn` value in the backend service.
4.  **Audience Check**: Always verify the `aud` (audience) claim on the receiver side to prevent token reuse across different systems.

---

## 📝 Configuration Summary

| Env Variable | Role | Required |
| :--- | :--- | :--- |
| `SSO_SHARED_SECRET` | Backend signing secret | Yes |
| `VITE_ODOO_URL` | Frontend redirection target | Yes |
| `API_URL` | Benote API root | Yes |

---

## 🤝 Contributing
For issues or feature requests regarding the SSO flow, please contact the Benote core team or open a PR in the `benote_sso` directory.
