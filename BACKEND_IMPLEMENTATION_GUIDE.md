# Backend Implementation Guide - Admin Role Support

## Overview

The Job Service needs to be updated to recognize and grant access to admin users. This guide provides implementation options for the backend team.

---

## Current Issue

**Frontend:** Admin users can log in successfully and receive a valid JWT with `"role": "admin"`

**Backend:** Job Service rejects all requests from admin users with 403 Forbidden

**Root Cause:** RBAC (Role-Based Access Control) only allows `"user"` and `"agency"` roles

---

## Solution Options

### Option 1: Add Admin Role to RBAC (Recommended)

**Effort:** Low | **Impact:** High | **Recommended:** YES

Simply add `"admin"` to the list of allowed roles in your RBAC middleware.

#### Implementation

**Node.js/Express Example:**

```javascript
// middleware/roleCheck.js
const ALLOWED_ROLES = ['user', 'agency', 'admin']; // Add 'admin' here

const roleCheckMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!ALLOWED_ROLES.includes(decoded.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required_roles: ALLOWED_ROLES,
        user_role: decoded.role
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = roleCheckMiddleware;
```

**Apply to routes:**

```javascript
// routes/jobs.js
const roleCheck = require('../middleware/roleCheck');

router.get('/posts', roleCheck, getJobs);
router.get('/posts/stats', roleCheck, getJobStats);
router.get('/posts/agency/stats', roleCheck, getAgencyStats);
router.get('/applications/stats', roleCheck, getApplicationStats);
```

#### Verification

After deployment, test with:

```bash
curl -H "Authorization: Bearer <admin_token>" \
  https://stage-jobs.besewonline.com/posts
```

Should return 200 OK instead of 403.

---

### Option 2: Use Custom Headers for Admin Override

**Effort:** Medium | **Impact:** Medium | **Recommended:** If Option 1 not possible

If you cannot modify the core RBAC, implement header-based override.

#### Implementation

**Node.js/Express Example:**

```javascript
// middleware/adminOverride.js
const adminOverrideMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const adminOverride = req.headers['x-admin-override'] === 'true';
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin override header is present AND token is admin
    if (adminOverride && decoded.role === 'admin') {
      // Grant full access
      req.user = decoded;
      req.isAdminOverride = true;
      return next();
    }
    
    // Otherwise, check normal roles
    const ALLOWED_ROLES = ['user', 'agency'];
    if (!ALLOWED_ROLES.includes(decoded.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required_roles: ALLOWED_ROLES,
        user_role: decoded.role
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = adminOverrideMiddleware;
```

**Apply to routes:**

```javascript
// routes/jobs.js
const adminOverride = require('../middleware/adminOverride');

router.get('/posts', adminOverride, getJobs);
router.get('/posts/stats', adminOverride, getJobStats);
```

#### Frontend Already Sends Headers

The frontend is already sending these headers:

```
X-Admin-Override: true
X-User-Role: admin
```

So the backend just needs to check for them.

---

### Option 3: Create Separate Admin Endpoints

**Effort:** High | **Impact:** Low | **Recommended:** Only if other options not viable

Create admin-specific endpoints that bypass role checks.

#### Implementation

```javascript
// routes/admin.js
const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin-only endpoints
router.get('/admin/posts', adminAuthMiddleware, getJobs);
router.get('/admin/posts/stats', adminAuthMiddleware, getJobStats);
router.get('/admin/posts/agency/stats', adminAuthMiddleware, getAgencyStats);
router.get('/admin/applications/stats', adminAuthMiddleware, getApplicationStats);
```

**Drawback:** Frontend would need to be updated to use `/admin/` endpoints

---

## Testing Checklist

After implementing one of the above options:

### 1. Test with Admin Token

```bash
# Get admin token from login
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test each endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://stage-jobs.besewonline.com/posts

curl -H "Authorization: Bearer $TOKEN" \
  https://stage-jobs.besewonline.com/posts/stats

curl -H "Authorization: Bearer $TOKEN" \
  https://stage-jobs.besewonline.com/posts/agency/stats

curl -H "Authorization: Bearer $TOKEN" \
  https://stage-jobs.besewonline.com/applications/stats
```

All should return 200 OK.

### 2. Test with User Token

```bash
# Get user token from login
USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Should still work
curl -H "Authorization: Bearer $USER_TOKEN" \
  https://stage-jobs.besewonline.com/posts
```

Should return 200 OK (existing functionality preserved).

### 3. Test with Invalid Token

```bash
# Should be rejected
curl -H "Authorization: Bearer invalid_token" \
  https://stage-jobs.besewonline.com/posts
```

Should return 401 Unauthorized.

### 4. Test with No Token

```bash
# Should be rejected
curl https://stage-jobs.besewonline.com/posts
```

Should return 401 Unauthorized.

---

## Endpoints Affected

These endpoints need to support admin role:

```
GET  /posts                    - List all jobs
GET  /posts/:id                - Get job details
POST /posts                    - Create job (if admin can create)
PUT  /posts/:id                - Update job (if admin can update)
DELETE /posts/:id              - Delete job (if admin can delete)

GET  /posts/stats              - Job statistics
GET  /posts/recent             - Recent jobs
GET  /posts/performance-metrics - Performance metrics

GET  /posts/agency/stats       - Agency statistics
GET  /posts/agency/detailed-stats - Detailed agency stats

GET  /applications/stats       - Application statistics
GET  /categories/stats         - Category statistics
```

---

## Verification from Frontend

The frontend has a debug tool that will verify the fix:

```javascript
// In browser console
window.__debugJobAuth()
```

This will test all endpoints and show:
- ✅ 200 OK (working)
- 🔒 403 Forbidden (still blocked)
- 💥 Network errors

---

## Rollback Plan

If the change causes issues:

1. **Immediate:** Revert the RBAC change
2. **Verify:** Test that user/agency roles still work
3. **Investigate:** Check logs for what went wrong
4. **Communicate:** Notify frontend team of rollback

---

## Monitoring & Logging

Add logging to track admin access:

```javascript
// In your middleware
if (decoded.role === 'admin') {
  console.log(`[ADMIN ACCESS] ${decoded.sub} - ${req.method} ${req.path}`);
}
```

This helps track:
- Which admin users are accessing what
- When admin access was granted
- Any unusual patterns

---

## Security Considerations

### Before Deploying

1. **Verify JWT Secret:** Ensure JWT_SECRET is strong and not exposed
2. **Check Token Validation:** Verify token signature is validated
3. **Review Permissions:** Ensure admins should have access to all endpoints
4. **Audit Logs:** Enable logging of admin access
5. **Rate Limiting:** Consider rate limiting for admin endpoints

### After Deploying

1. **Monitor Logs:** Watch for unusual admin access patterns
2. **Test Regularly:** Periodically verify admin access works
3. **Update Documentation:** Document that admins have full access
4. **Security Review:** Have security team review the changes

---

## Timeline

- **Immediate:** Implement Option 1 (add admin role to RBAC)
- **Testing:** 1-2 hours
- **Deployment:** 30 minutes
- **Verification:** 15 minutes

---

## Support

If you have questions:

1. Check the frontend debug output: `window.__debugJobAuth()`
2. Review the error response body for details
3. Check server logs for JWT validation errors
4. Verify JWT_SECRET matches across services

---

## Related Files

- **Frontend:** `src/services/api.ts` - Sends admin override headers
- **Frontend:** `src/hooks/useJobServiceAuth.ts` - Auth utilities
- **Frontend:** `src/pages/dashboard/JobMonitoring.tsx` - Uses job service
- **Debug:** `DEBUG_JOB_SERVICE.md` - Frontend debug guide
