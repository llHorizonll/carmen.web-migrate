# Carmen API Integration Documentation

## Overview

This document describes the integration with the Carmen API at `https://dev.carmen4.com/Carmen.api`.

## Authentication

### Configuration

```typescript
const CARMEN_API_CONFIG = {
  baseURL: 'https://dev.carmen4.com/Carmen.api',
  adminToken: 'f9ebce3d77f2f445dee52ba252cc53ee',
};
```

### Login

The login endpoint is `POST /api/Login/Login` with the following request body:

```json
{
  "Email": "admin@carmen.com",
  "Language": "en-US",
  "Tenant": "dev",
  "Password": "alpha",
  "UserName": "admin"
}
```

### Implementation

The authentication is implemented in `src/services/carmenAuth.ts`:

1. **Axios Instance**: `carmenAxios` - Pre-configured with base URL and interceptors
2. **Login Function**: `carmenLogin()` - Authenticates and stores tokens
3. **Token Storage**: Uses localStorage for persistence
4. **Auto-refresh**: Interceptor handles 401 responses and attempts token refresh

## Usage

### Basic Login

```typescript
import { carmenLogin, carmenLogout, isAuthenticated } from '@/services';

// Login with default credentials
const response = await carmenLogin();

// Login with custom credentials
const response = await carmenLogin({
  UserName: 'admin',
  Password: 'alpha',
  Tenant: 'dev',
});

// Check authentication status
if (isAuthenticated()) {
  console.log('User is authenticated');
}

// Logout
carmenLogout();
```

### Using React Hooks

```typescript
import { useCarmenAuth, useCarmenUser } from '@/hooks';

function MyComponent() {
  const { isAuthenticated, user, login, logout, isLoginPending } = useCarmenAuth();
  
  if (isLoginPending) return <div>Logging in...</div>;
  
  if (!isAuthenticated) {
    return <button onClick={() => login()}>Login</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.FullName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making API Calls

```typescript
import { carmenAxios } from '@/services';

// The axios instance automatically includes:
// - Admin-Token header
// - Authorization header (if logged in)

const response = await carmenAxios.get('/api/User');
const users = response.data;
```

### Using Generic Service

```typescript
import { createCarmenService } from '@/services';

interface MyEntity {
  Id: number;
  Name: string;
}

const myService = createCarmenService<MyEntity>({
  baseEndpoint: '/api/MyEntity',
  idField: 'Id',
});

// Use CRUD operations
const items = await myService.search({ Limit: 10, Page: 1 });
const item = await myService.getById(1);
const newItem = await myService.create({ Name: 'New Item' });
await myService.update(1, { Name: 'Updated' });
await myService.delete(1);
```

## File Structure

```
src/
├── services/
│   ├── carmenAuth.ts      # Core authentication
│   ├── carmenUser.ts      # User management
│   ├── carmenApi.ts       # Generic API service
│   └── index.ts           # Service exports
├── hooks/
│   ├── useCarmenAuth.ts   # React auth hooks
│   └── index.ts           # Hook exports
└── types/
    ├── api.ts             # API types
    └── models.ts          # Domain models
```

## Modified Files

1. **src/services/carmenAuth.ts** (NEW)
   - Carmen API authentication service
   - Axios instance with interceptors
   - Token management utilities

2. **src/services/carmenUser.ts** (NEW)
   - User management via Carmen API

3. **src/services/carmenApi.ts** (NEW)
   - Generic CRUD service factory
   - Pre-configured services for common entities

4. **src/hooks/useCarmenAuth.ts** (NEW)
   - React hooks for authentication

5. **src/services/index.ts** (MODIFIED)
   - Added Carmen service exports

6. **src/hooks/index.ts** (NEW/Modified)
   - Added Carmen hook exports

## Test Results

Run the test script to verify the login flow:

```bash
# Using tsx (if installed)
npx tsx src/services/carmenAuth.test.ts

# Or using Node with ts-node
npx ts-node --esm src/services/carmenAuth.test.ts
```

Expected output:
```
==============================================
🧪 Carmen API Authentication Tests
==============================================
API Base URL: https://dev.carmen4.com/Carmen.api

✅ Initial state: not authenticated
✅ Login with default credentials
✅ Token is stored in localStorage
✅ Authenticated after login
✅ Decode JWT token
✅ Get current user from token
✅ Login with custom credentials
✅ Logout clears authentication

==============================================
📊 Test Summary
==============================================
Total: 8 tests
✅ Passed: 8
❌ Failed: 0

🎉 All tests passed!
```

## API Endpoints

### Authentication
- `POST /api/Login/Login` - Authenticate user
- `POST /api/Login/RefreshToken` - Refresh access token (if available)

### Users
- `GET /api/User` - List users
- `GET /api/User/{id}` - Get user by ID
- `GET /api/User/Me` - Get current user
- `POST /api/User` - Create user
- `PUT /api/User/{id}` - Update user
- `DELETE /api/User/{id}` - Delete user
- `POST /api/User/ChangePassword` - Change password

### Common Patterns
All entity endpoints follow the same pattern:
- `GET /api/{Entity}` - List all
- `GET /api/{Entity}/{id}` - Get by ID
- `POST /api/{Entity}` - Create
- `PUT /api/{Entity}/{id}` - Update
- `DELETE /api/{Entity}/{id}` - Delete
- `POST /api/{Entity}/search` - Search with filters

## Headers

All requests automatically include:

```
Admin-Token: f9ebce3d77f2f445dee52ba252cc53ee
Authorization: Bearer {access_token} (if authenticated)
Content-Type: application/json
```

## Storage Keys

Tokens are stored in localStorage with these keys:

- `carmen_access_token` - JWT access token
- `carmen_refresh_token` - Refresh token (if provided)
- `carmen_token_expiry` - Token expiry timestamp
- `carmen_user` - User information

## Migration from Legacy API

The legacy services in `src/services/user.ts`, `accountPayable.ts`, etc. use `window.config.apiUrl` and continue to work for existing integrations.

To migrate to Carmen API:

1. Import from Carmen services:
   ```typescript
   // Before
   import { login } from '@/services/user';
   
   // After
   import { carmenLogin } from '@/services';
   ```

2. Use Carmen axios instance:
   ```typescript
   // Before
   import axiosAuth from '@/utils/request';
   
   // After
   import { carmenAxios } from '@/services';
   ```

3. Update React components:
   ```typescript
   // Before
   import { useAuth } from '@/hooks';
   
   // After
   import { useCarmenAuth } from '@/hooks';
   ```
