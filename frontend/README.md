# @benote/sso-frontend

This package provides frontend utilities to handle the SSO flow for the Benote ecosystem using React hooks.

## Installation

```bash
npm install @benote/sso-frontend
```

## Peer Dependencies

- `react` (^17.0.0 || ^18.0.0)

## Usage

### 1. Service Wrapper

```javascript
// frontend/src/services/ssoService.js
import { useSSO } from '@benote/sso-frontend';

export const triggerExternalSSO = async (apiEndpoint, targetBaseUrl, authToken) => {
  const { triggerSSO } = useSSO();
  await triggerSSO(apiEndpoint, targetBaseUrl, authToken, {
    allowedTargetOrigins: [new URL(targetBaseUrl).origin],
  });
};
```

### 2. UI Integration

```jsx
// frontend/src/shared/components/ui/ExternalAppButton.jsx
const handleClick = async () => {
  const apiEndpoint = 'http://localhost:3060/api/auth/sso/external';
  const targetBaseUrl = 'http://localhost:8070'; // External app URL
  const authToken = localStorage.getItem('jwt'); 

  await triggerExternalSSO(apiEndpoint, targetBaseUrl, authToken);
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
| `apiEndpoint` | `string` | The Benote backend URL to get the token (e.g., `/api/auth/sso/external`). |
| `targetBaseUrl` | `string` | The base URL of the target system. |
| `authToken` | `string` | The current user's Benote session token. |
