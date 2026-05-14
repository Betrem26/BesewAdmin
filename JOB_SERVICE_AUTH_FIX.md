# Job Service Authentication Fix - Admin Role Issue

## Problem Summary

When logging in as an **admin** user, the Job Monitoring dashboard returns a **403 Forbidden** error, even though:
- The admin token is valid and properly stored in Redux
- The Authorization header is correctly sent to the Job Service
- The same token works fine for other services (Account Service, etc.)

### Root Cause

The Job Service (`stage-jobs.besewonline.com`) is configured to only accept requests from users with `"user"` or `"agency"` roles. It does **not** recognize the `"admin"` role, even though admins should have access to all resources.

**Token Payload (Admin User):**
```json
{
  "sub": "ETH26-1-TK-004",
  "role": "admin",
  "email": null,
  "phonenumber": "+251909534811",
  "subscription": { ... }
}
```

The Job Service's role-based access control (RBAC) is rejecting this because `role !== "user" && role !== "agency"`.

---

## Solution Implemented

### 1. **Frontend Workaround: Admin Override Headers** (`src/services/api.ts`)

Added custom headers to signal admin access to the Job Service:

```typescript
// For admin users accessing job service, add override headers
if (isJobService && decoded.role === 'admin') {
  config.headers['X-Admin-Override'] = 'true';
  config.headers['X-User-Role'] = 'admin';
}
```

**What this does:**
- Detects when an admin user is making a request to the Job Service
- Adds `X-Admin-Override: true` header to signal elevated permissions
- Adds `X-User-Role: admin` header to explicitly state the role

**Backend Implementation Needed:**
The Job Service backend should check for these headers and grant access:

```javascript
// In Job Service middleware
if (req.headers['x-admin-override'] === 'true' || decoded.role === 'admin') {
  // Grant access to all endpoints
  next();
}
```

### 2. **Auth Hook: `useJobServiceAuth`** (`src/hooks/useJobServiceAuth.ts`)

Created a custom hook to check job service access permissions:

```typescript
const { isAdmin, canAccessJobService, userRole } = useJobServiceAuth();
```

**Features:**
- Checks if user is admin, user, or agency
- Decodes JWT to access full token claims
- Provides `canAccessJobService` boolean for conditional rendering

### 3. **Improved Error Handling** (`src/pages/dashboard/JobMonitoring.tsx`)

Enhanced error messages to help diagnose the issue:

```typescript
if (err.response?.status === 403) {
  if (isAdmin) {
    setError(
      'Access Denied: The Job Service is not recognizing your admin role. ' +
      'This is a backend configuration issue. Please contact support.'
    );
  }
}
```

### 4. **Admin Access Warning Banner**

Added a warning banner for admin users explaining the situation:

```
⚠️ Admin Access Notice
You are accessing this as an admin. If you see a 403 error below, 
the Job Service backend needs to be configured to recognize admin roles.
```

---

## What Needs to Happen on the Backend

### Option A: Recognize Admin Role (Recommended)

Update the Job Service's role-based access control to include `"admin"`:

```javascript
// In Job Service RBAC middleware
const allowedRoles = ['user', 'agency', 'admin'];
if (!allowedRoles.includes(decoded.role)) {
  return res.status(403).json({ error: 'Insufficient permissions' });
}
```

### Option B: Use Custom Headers

If the backend cannot be modified immediately, implement header-based override:

```javascript
// In Job Service middleware
if (req.headers['x-admin-override'] === 'true') {
  // Grant full access
  next();
} else if (!['user', 'agency'].includes(decoded.role)) {
  return res.status(403).json({ error: 'Insufficient permissions' });
}
```

### Option C: Create Admin-Specific Endpoints

Create separate admin endpoints that don't require user/agency roles:

```
GET /admin/posts/stats
GET /admin/posts
GET /admin/posts/agency/stats
```

---

## Testing the Fix

### 1. **Check Headers in Browser Console**

Run this in the browser console while logged in as admin:

```javascript
window.__debugJobAuth()
```

This will show:
- ✅ Which endpoints return 200 (working)
- 🔒 Which endpoints return 403 (blocked)
- 💥 Network errors

### 2. **Verify Token Claims**

Check what's in your JWT:

```javascript
const token = localStorage.getItem('accessToken') || 
              sessionStorage.getItem('accessToken');
const claims = JSON.parse(atob(token.split('.')[1]));
console.log('Role:', claims.role);
console.log('Sub:', claims.sub);
```

### 3. **Monitor Network Requests**

In DevTools Network tab, check the Job Service requests:
- Look for `X-Admin-Override: true` header
- Verify `Authorization: Bearer <token>` is present
- Check response status (should be 200, not 403)

---

## Files Modified

1. **`src/services/api.ts`**
   - Added admin role detection in request interceptor
   - Added custom headers for admin users
   - Enhanced 403 error logging

2. **`src/hooks/useJobServiceAuth.ts`** (NEW)
   - Custom hook for job service auth checks
   - JWT decoding utilities
   - Role and permission helpers

3. **`src/pages/dashboard/JobMonitoring.tsx`**
   - Integrated `useJobServiceAuth` hook
   - Added admin warning banner
   - Improved 403 error messages
   - Better error handling for role-based access

---

## Next Steps

1. **Immediate:** Test the frontend changes with the debug tool
2. **Short-term:** Contact Job Service team to implement backend fix
3. **Long-term:** Standardize role-based access control across all services

---

## Related Issues

- **Service:** Job Service (`stage-jobs.besewonline.com`)
- **Endpoint:** `/posts`, `/posts/stats`, `/posts/agency/stats`
- **Error:** 403 Forbidden
- **Affected Users:** Admin accounts
- **Workaround:** Use custom headers (frontend implemented)
- **Permanent Fix:** Backend role configuration update
