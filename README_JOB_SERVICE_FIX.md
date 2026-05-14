# Job Service Admin Role 403 Error - Complete Fix

## Overview

This document provides a complete solution for the Job Service 403 Forbidden error that admin users encounter when accessing the Job Monitoring dashboard.

**Status:** ✅ Frontend implementation complete | ⏳ Backend implementation required

---

## The Problem

Admin users receive a **403 Forbidden** error when trying to access:
- Job Monitoring dashboard
- Job statistics
- Agency statistics
- Application statistics

**Why?** The Job Service backend only accepts `"user"` and `"agency"` roles, not `"admin"`.

---

## The Solution

### Frontend (COMPLETED ✅)

The frontend has been updated to:
1. Detect admin users making requests to Job Service
2. Send custom headers (`X-Admin-Override: true`, `X-User-Role: admin`)
3. Provide better error messages
4. Show admin warning banner
5. Include debug tools

### Backend (REQUIRED ⏳)

The backend needs to:
1. Add `"admin"` to the list of allowed roles in RBAC
2. Or check for custom headers and grant access to admins

---

## Documentation Files

### For Quick Reference
- **`SOLUTION_SUMMARY.md`** - Quick overview and next steps
- **`ACTION_ITEMS.md`** - Checklist for all teams

### For Debugging
- **`DEBUG_JOB_SERVICE.md`** - How to use the debug tool and troubleshoot

### For Implementation
- **`BACKEND_IMPLEMENTATION_GUIDE.md`** - Step-by-step backend implementation
- **`JOB_SERVICE_AUTH_FIX.md`** - Technical details and architecture

---

## Quick Start

### For Frontend Developers

**Test the fix:**
```javascript
// In browser console
window.__debugJobAuth()
```

**Expected output:**
```
✅ 200 /posts
✅ 200 /posts/stats
✅ 200 /posts/agency/stats
✅ 200 /applications/stats
✅ 200 /posts?page=1&limit=5
```

If all show 403, the backend still needs to be updated.

### For Backend Developers

**Implement the fix (Option A - Recommended):**

```javascript
// In Job Service RBAC middleware
const ALLOWED_ROLES = ['user', 'agency', 'admin']; // Add 'admin'

if (!ALLOWED_ROLES.includes(decoded.role)) {
  return res.status(403).json({ error: 'Insufficient permissions' });
}
```

**Test the fix:**
```bash
curl -H "Authorization: Bearer <admin_token>" \
  https://stage-jobs.besewonline.com/posts
```

Should return 200 OK.

---

## Code Changes

### Files Modified

1. **`src/services/api.ts`**
   - Added admin role detection in request interceptor
   - Added custom headers for admin users
   - Enhanced 403 error logging

2. **`src/pages/dashboard/JobMonitoring.tsx`**
   - Integrated `useJobServiceAuth` hook
   - Added admin warning banner
   - Improved 403 error messages

### Files Created

1. **`src/hooks/useJobServiceAuth.ts`**
   - Custom hook for job service authentication
   - JWT decoding utilities
   - Role and permission helpers

---

## Testing

### Frontend Testing

1. **Login as admin**
   ```
   Phone: +251909534811
   Password: [your password]
   ```

2. **Navigate to Job Monitoring**
   - Should see admin warning banner
   - Should see error message if backend not updated

3. **Run debug tool**
   ```javascript
   window.__debugJobAuth()
   ```

4. **Check headers in DevTools**
   - Network tab → Filter "stage-jobs"
   - Look for `X-Admin-Override: true` header

### Backend Testing

1. **Get admin token**
   - Login as admin
   - Copy token from Redux store

2. **Test endpoints**
   ```bash
   curl -H "Authorization: Bearer <token>" \
     https://stage-jobs.besewonline.com/posts
   ```

3. **Verify response**
   - Should be 200 OK
   - Should return job data

---

## Troubleshooting

### Issue: Still getting 403

**Cause:** Backend hasn't been updated

**Solution:**
1. Check `DEBUG_JOB_SERVICE.md` for debugging steps
2. Contact backend team
3. Share `BACKEND_IMPLEMENTATION_GUIDE.md`

### Issue: Some endpoints work, others don't

**Cause:** Inconsistent role configuration

**Solution:**
1. Run `window.__debugJobAuth()` to identify failing endpoints
2. Report to backend team
3. Ask them to review RBAC rules

### Issue: Token shows as null

**Cause:** Login didn't complete successfully

**Solution:**
1. Log out completely
2. Clear browser cache
3. Log back in

---

## Architecture

### Request Flow

```
Admin User
    ↓
Login (Account Service)
    ↓
Get JWT with role: "admin"
    ↓
Store in Redux
    ↓
Access Job Monitoring
    ↓
Request to Job Service
    ↓
API Interceptor detects admin role
    ↓
Add X-Admin-Override: true header
    ↓
Send request with Authorization header
    ↓
Job Service receives request
    ↓
Check role (currently fails with 403)
    ↓
[BACKEND FIX NEEDED]
    ↓
Grant access to admin
    ↓
Return 200 OK with data
```

### Custom Headers

The frontend sends these headers for admin users:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Admin-Override: true
X-User-Role: admin
Content-Type: application/json
```

The backend should check for these headers and grant access.

---

## Security Considerations

### Frontend
- ✅ Token is stored securely in Redux
- ✅ Token is only sent to authorized services
- ✅ Custom headers are only added for admin users
- ✅ No sensitive data is logged

### Backend
- ⚠️ Verify JWT signature before trusting claims
- ⚠️ Validate token expiration
- ⚠️ Log admin access for audit trail
- ⚠️ Rate limit admin endpoints if needed

---

## Timeline

| Phase | Status | Timeline |
|-------|--------|----------|
| Frontend Implementation | ✅ Complete | Done |
| Backend Implementation | ⏳ Pending | 1-2 hours |
| Testing | ⏳ Pending | 1 hour |
| Deployment | ⏳ Pending | 30 minutes |
| Monitoring | ⏳ Pending | Ongoing |

---

## Success Criteria

- [x] Frontend detects admin role
- [x] Frontend sends custom headers
- [x] Frontend shows warning banner
- [x] Frontend has debug tool
- [ ] Backend recognizes admin role
- [ ] Backend returns 200 OK for admin requests
- [ ] Admin users can access Job Monitoring
- [ ] No 403 errors for admin users
- [ ] User/agency roles still work
- [ ] No performance degradation

---

## Next Steps

### Immediate (Today)
1. ✅ Frontend implementation complete
2. ⏳ Backend team reviews implementation guide
3. ⏳ Backend team starts implementation

### Short-term (Tomorrow)
1. ⏳ Backend implementation complete
2. ⏳ QA begins testing
3. ⏳ Deploy to staging

### Long-term (This Week)
1. ⏳ Staging tests pass
2. ⏳ Deploy to production
3. ⏳ Monitor for issues

---

## Support

### For Debugging
→ See `DEBUG_JOB_SERVICE.md`

### For Backend Implementation
→ See `BACKEND_IMPLEMENTATION_GUIDE.md`

### For Technical Details
→ See `JOB_SERVICE_AUTH_FIX.md`

### For Quick Reference
→ See `SOLUTION_SUMMARY.md`

### For Action Items
→ See `ACTION_ITEMS.md`

---

## Key Files

### Frontend Code
- `src/services/api.ts` - API configuration and interceptors
- `src/pages/dashboard/JobMonitoring.tsx` - Dashboard component
- `src/hooks/useJobServiceAuth.ts` - Auth utilities

### Documentation
- `SOLUTION_SUMMARY.md` - Quick overview
- `DEBUG_JOB_SERVICE.md` - Debugging guide
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Backend implementation
- `JOB_SERVICE_AUTH_FIX.md` - Technical details
- `ACTION_ITEMS.md` - Team checklists

---

## FAQ

**Q: Why is the admin role not recognized?**
A: The Job Service backend only checks for "user" and "agency" roles. It needs to be updated to include "admin".

**Q: How do I test if the fix works?**
A: Run `window.__debugJobAuth()` in the browser console. All endpoints should return 200 OK.

**Q: What if I'm still getting 403?**
A: The backend hasn't been updated yet. Contact the backend team and share the implementation guide.

**Q: Will this affect other users?**
A: No. User and agency roles will continue to work as before. This only adds support for admin role.

**Q: How long will this take to fix?**
A: Frontend is done. Backend implementation should take 1-2 hours. Total time to production: 1-2 days.

---

## Contact

For questions or issues:
1. Check the relevant documentation file
2. Run the debug tool: `window.__debugJobAuth()`
3. Contact your team lead
4. Escalate to backend team if needed

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-05-12 | Initial implementation |

---

## License

This fix is part of the BESEW platform and follows the same license as the main project.

---

**Last Updated:** May 12, 2024
**Status:** Ready for backend implementation
**Next Review:** After backend deployment
