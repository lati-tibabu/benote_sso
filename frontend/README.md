# @benote/sso-frontend

This package provides frontend utilities to handle the SSO flow for the Benote ecosystem using React hooks.

## Installation

```bash
npm install @benote/sso-frontend
```

## Peer Dependencies

- `react` (^17.0.0 || ^18.0.0)

## Usage

```javascript
import { useSSO } from '@benote/sso-frontend';

const MyComponent = () => {
  const { triggerSSO } = useSSO();

  const handleOdooRedirect = async () => {
    const apiEndpoint = 'https://api.benote.fr/api/auth/sso/odoo';
    const targetBaseUrl = 'https://erp.example.com';
    const authToken = 'USER_SESSION_JWT';

    await triggerSSO(apiEndpoint, targetBaseUrl, authToken);
  };

  return (
    <button onClick={handleOdooRedirect}>
      Go to Odoo
    </button>
  );
};
```

### API Reference

#### `useSSO()` Hook

Returns an object with the following method:

##### `triggerSSO(apiEndpoint, targetBaseUrl, authToken)`

Triggers the SSO redirect via a hidden form POST. This method:
1.  Fetches an SSO token from your backend `apiEndpoint`.
2.  Dynamically creates and submits a hidden form to `${targetBaseUrl}/auth/sso/callback`.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `apiEndpoint` | `string` | The Benote backend URL to get the token (e.g., `/api/auth/sso/odoo`). |
| `targetBaseUrl` | `string` | The base URL of the target system (e.g., Odoo URL). |
| `authToken` | `string` | The current user's Benote session token. |
