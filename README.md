# 🚀 Benote SSO (Single Sign-On) Module

A robust, enterprise-grade SSO solution for the Benote ecosystem. This module enables seamless, secure authentication from Benote to external platforms like **Odoo (OpenERP)**, **Moodle**, or custom third-party services using a **JWT POST-Binding** flow.

---

## 🏗️ Architecture Flow

The SSO process follows the "POST Binding" pattern to ensure high security and avoid sensitive tokens appearing in browser history.

The `@benote/sso-backend` and `@benote/sso-frontend` packages are used to facilitate Single Sign-On (SSO) between Benote and an external Odoo instance.

### **Backend Usage (`@benote/sso-backend`)**

In the backend, the package is used to generate a secure SSO token for a target application (in this case, Odoo).

*   **Implementation:** In authRoutes.js, the package is imported as `ssoService`.
*   **SSO Endpoint:** A dedicated route `POST /api/auth/sso/odoo` is defined in authRoutes.js.
*   **Token Generation:** When a request is made to this endpoint, the backend uses `ssoService.generateToken()` to create a JWT signed with `ODOO_JWT_SECRET`. This token contains basic user information and is scoped for the `odoo` audience.

```javascript
// backend/routes/authRoutes.js
router.post('/sso/odoo', authMiddleware.authMiddleware, async (req, res) => {
  const user = req.user;
  const secret = process.env.ODOO_JWT_SECRET;
  const audience = 'odoo';

  const token = ssoService.generateToken(user, [], audience, secret);
  res.json({ token });
})
```

### **Frontend Usage (`@benote/sso-frontend`)**

In the frontend, the package manages the redirection logic, including fetching the SSO token from the backend and redirecting the user to the target application with that token.

*   **Service Wrapper:** In ssoService.js, a wrapper function `triggerOdooSSO` utilizes the `useSSO` hook provided by the package.
*   **Redirection Flow:** The `triggerSSO` function handles the handshake:
    1.  It calls the Benote backend endpoint.
    2.  It receives the generated SSO token.
    3.  It redirects the user to the Odoo instance URL with the token attached.

```javascript
// frontend/src/services/ssoService.js
import { useSSO } from '@benote/sso-frontend';

export const triggerOdooSSO = async (apiEndpoint, targetBaseUrl, authToken) => {
  const { triggerSSO } = useSSO();
  await triggerSSO(apiEndpoint, targetBaseUrl, authToken);
};
```

### **UI Integration**

The SSO flow is triggered by the OpenERPButton.jsx component, which passes the necessary configuration (backend API URL and Odoo target URL) to the service.

```jsx
// frontend/src/shared/components/ui/OpenERPButton.jsx
const handleClick = async () => {
  const apiEndpoint = 'http://localhost:3060/api/auth/sso/odoo';
  const targetBaseUrl = 'http://localhost:8070'; // Odoo instance URL
  const authToken = localStorage.getItem('jwt'); 

  await triggerOdooSSO(apiEndpoint, targetBaseUrl, authToken);
};
```

## 📦 Package Parts

| Package | Purpose | Technology |
| :--- | :--- | :--- |
| `backend` | Handles JWT generation, signing, and permission mapping. | Node.js / JWT |
| `frontend` | Handles API calls and automatic POST submission. | React / JavaScript |

---

##  External Integration (The Odoo Side)

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
