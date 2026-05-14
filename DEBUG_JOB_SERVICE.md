# Job Service Debug Guide

## Quick Diagnosis

### Step 1: Open Browser Console

Press `F12` or right-click → Inspect → Console tab

### Step 2: Run Debug Tool

Paste this command and press Enter:

```javascript
window.__debugJobAuth()
```

### Step 3: Interpret Results

The output will show something like:

```
[debugJobAuth] Raw fetch() to job service — bypassing Axios
Base URL: https://stage-jobs.besewonline.com
Token (first 60 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFVEgyNi0xLVRLLTAwNCIsImVtYWlsIjpudWxs…

✅ 200 /posts
✅ 200 /posts/stats
✅ 200 /posts/agency/stats
✅ 200 /applications/stats
✅ 200 /posts?page=1&limit=5

If all show 403: the backend is rejecting this token regardless of how it is sent.
If any show 200: there was an Axios header issue (now fixed).
```

---

## Interpreting Results

### All Endpoints Return ✅ 200
**Status:** ✅ WORKING
- Your token is valid
- Job Service recognizes your role
- No action needed

### All Endpoints Return 🔒 403
**Status:** ❌ BACKEND ISSUE
- Job Service is rejecting your admin role
- This is a backend configuration problem
- **Action:** Contact Job Service team to add admin role to RBAC

### Mixed Results (Some 200, Some 403)
**Status:** ⚠️ PARTIAL ACCESS
- Some endpoints work, others don't
- Likely a permission/role issue
- **Action:** Check which endpoints fail and report to backend team

### Network Error 💥
**Status:** ❌ CONNECTION ISSUE
- Cannot reach Job Service
- Check internet connection
- Verify Job Service URL is correct

---

## Checking Your Token

### View Token Claims

```javascript
// Get token from Redux
const token = window.__store?.getState?.()?.user?.accessToken;

// Or from localStorage
const token = localStorage.getItem('accessToken');

// Decode and view
const claims = JSON.parse(atob(token.split('.')[1]));
console.log(JSON.stringify(claims, null, 2));
```

**Expected output for admin:**
```json
{
  "sub": "ETH26-1-TK-004",
  "role": "admin",
  "email": null,
  "phonenumber": "+251909534811",
  "subscription": { ... },
  "iat": 1778563177,
  "exp": 1778649577
}
```

### Check Token Expiration

```javascript
const token = window.__store?.getState?.()?.user?.accessToken;
const claims = JSON.parse(atob(token.split('.')[1]));
const expiresAt = new Date(claims.exp * 1000);
const now = new Date();

console.log('Token expires at:', expiresAt);
console.log('Is expired?', now > expiresAt);
console.log('Time remaining:', Math.round((expiresAt - now) / 1000 / 60), 'minutes');
```

---

## Checking Request Headers

### View Headers Sent to Job Service

Open DevTools → Network tab → Filter by "stage-jobs"

Click on any request and check:

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Admin-Override: true
X-User-Role: admin
Content-Type: application/json
```

**Response Headers:**
```
Status: 200 OK (or 403 Forbidden)
Content-Type: application/json
```

---

## Common Issues & Solutions

### Issue: "Token in Redux: ⚠ NULL"

**Problem:** No token stored in Redux
**Solution:**
1. Log out and log back in
2. Check if login was successful
3. Verify localStorage has `refreshToken`

### Issue: "Authorization: ⚠ MISSING"

**Problem:** Token not being attached to request
**Solution:**
1. Check Redux store has token
2. Refresh the page
3. Clear browser cache and try again

### Issue: All endpoints return 403

**Problem:** Job Service doesn't recognize admin role
**Solution:**
1. This is a backend issue
2. Contact Job Service team
3. Ask them to add `"admin"` to allowed roles in RBAC

### Issue: Some endpoints return 403, others 200

**Problem:** Inconsistent role-based access control
**Solution:**
1. Check which endpoints fail
2. Report to backend team with endpoint list
3. May need separate admin endpoints

---

## Advanced Debugging

### Check Redux Store

```javascript
// View entire user state
console.log(window.__store?.getState?.()?.user);

// View just the token
console.log(window.__store?.getState?.()?.user?.accessToken?.slice(0, 50) + '...');

// View user info
console.log(window.__store?.getState?.()?.user?.user);
```

### Monitor API Calls

In DevTools Console, look for logs like:

```
[JobAPI] GET https://stage-jobs.besewonline.com/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…
Token in Redux: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…
Admin Override: true
Full headers: Object { Authorization: "Bearer ...", X-Admin-Override: "true", ... }
```

### Test Raw Fetch

```javascript
const token = window.__store?.getState?.()?.user?.accessToken;
const response = await fetch('https://stage-jobs.besewonline.com/posts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
console.log('Status:', response.status);
console.log('Body:', await response.json());
```

---

## When to Contact Support

Contact the Job Service team if:

1. ✅ All debug endpoints return 200, but dashboard still shows error
   - Likely a frontend caching issue
   - Try: Hard refresh (Ctrl+Shift+R), clear localStorage

2. 🔒 All debug endpoints return 403
   - Backend doesn't recognize admin role
   - Ask them to: Add `"admin"` to RBAC allowed roles

3. 💥 Network errors or connection issues
   - Job Service might be down
   - Check service status page

4. ⚠️ Mixed results (some 200, some 403)
   - Inconsistent role configuration
   - Ask them to review RBAC rules

---

## Support Information

**Job Service URL:** https://stage-jobs.besewonline.com

**Endpoints to check:**
- `/posts` - List all jobs
- `/posts/stats` - Job statistics
- `/posts/agency/stats` - Agency-specific stats
- `/applications/stats` - Application statistics

**Include in support ticket:**
- Output from `window.__debugJobAuth()`
- Your token claims (from console)
- Screenshot of error message
- Browser and OS information
