# Action Items - Job Service Admin Role Fix

## For Frontend Team (COMPLETED ✅)

- [x] Add admin role detection in API interceptor
- [x] Send custom headers (`X-Admin-Override`, `X-User-Role`)
- [x] Create `useJobServiceAuth` hook
- [x] Improve error handling for 403 errors
- [x] Add admin warning banner to dashboard
- [x] Create debug tool (`window.__debugJobAuth()`)
- [x] Document the issue and solution
- [x] Test TypeScript compilation

**Status:** Ready for testing

---

## For Backend Team (REQUIRED)

### Priority: HIGH | Timeline: 1-2 hours

### Option 1: Add Admin Role to RBAC (Recommended)

**File:** Job Service RBAC middleware

**Change:**
```javascript
// Before
const ALLOWED_ROLES = ['user', 'agency'];

// After
const ALLOWED_ROLES = ['user', 'agency', 'admin'];
```

**Affected Endpoints:**
- GET `/posts`
- GET `/posts/stats`
- GET `/posts/agency/stats`
- GET `/applications/stats`
- GET `/posts/recent`
- GET `/posts/performance-metrics`
- And any other protected endpoints

**Testing:**
```bash
curl -H "Authorization: Bearer <admin_token>" \
  https://stage-jobs.besewonline.com/posts
```

Should return 200 OK.

**Effort:** 15 minutes
**Risk:** Low (just adding a role)
**Rollback:** Easy (revert the change)

---

### Option 2: Check Custom Headers (If Option 1 not possible)

**File:** Job Service middleware

**Add:**
```javascript
if (req.headers['x-admin-override'] === 'true' && decoded.role === 'admin') {
  // Grant full access
  next();
} else if (!ALLOWED_ROLES.includes(decoded.role)) {
  return res.status(403).json({ error: 'Insufficient permissions' });
}
```

**Effort:** 30 minutes
**Risk:** Medium (more complex logic)
**Rollback:** Moderate (need to revert middleware)

---

## For QA Team

### Test Cases

1. **Admin User - Job Monitoring Dashboard**
   - [ ] Login as admin
   - [ ] Navigate to Job Monitoring
   - [ ] Verify no 403 errors
   - [ ] Verify jobs list loads
   - [ ] Verify stats display correctly

2. **Admin User - Debug Tool**
   - [ ] Open browser console
   - [ ] Run `window.__debugJobAuth()`
   - [ ] Verify all endpoints return 200
   - [ ] Check headers are correct

3. **User/Agency - Existing Functionality**
   - [ ] Login as user
   - [ ] Verify job service still works
   - [ ] Login as agency
   - [ ] Verify job service still works

4. **Error Handling**
   - [ ] Invalid token → 401 error
   - [ ] No token → 401 error
   - [ ] Expired token → 401 error

### Test Environments

- [ ] Local development
- [ ] Staging environment
- [ ] Production (after staging passes)

---

## For DevOps/Infrastructure

### Deployment Checklist

- [ ] Backup current Job Service code
- [ ] Deploy backend changes to staging
- [ ] Run smoke tests
- [ ] Monitor logs for errors
- [ ] Deploy to production
- [ ] Monitor production logs

### Monitoring

Add logging for admin access:

```javascript
if (decoded.role === 'admin') {
  console.log(`[ADMIN] ${decoded.sub} - ${req.method} ${req.path}`);
}
```

Monitor for:
- Unusual access patterns
- Failed authentication attempts
- Performance issues

---

## Timeline

### Day 1 (Today)
- [x] Frontend implementation complete
- [ ] Backend team reviews implementation guide
- [ ] Backend team starts implementation

### Day 2
- [ ] Backend implementation complete
- [ ] QA begins testing
- [ ] Deploy to staging

### Day 3
- [ ] Staging tests pass
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Communication

### To Backend Team

**Subject:** Job Service Admin Role Support Needed

**Message:**
```
The admin dashboard is getting 403 errors from the Job Service because 
it doesn't recognize the "admin" role. 

Frontend is ready with custom headers and improved error handling.

Please update the Job Service RBAC to include "admin" role:
const ALLOWED_ROLES = ['user', 'agency', 'admin'];

See BACKEND_IMPLEMENTATION_GUIDE.md for details.

Frontend debug tool: window.__debugJobAuth()
```

### To QA Team

**Subject:** Job Service Admin Role - Ready for Testing

**Message:**
```
Frontend changes are complete. Backend team is implementing the fix.

Once backend is deployed, please test:
1. Admin user can access Job Monitoring
2. No 403 errors
3. Jobs list loads correctly
4. Stats display correctly

Debug tool: window.__debugJobAuth()
```

### To DevOps Team

**Subject:** Job Service Deployment - Admin Role Support

**Message:**
```
Backend team will provide updated Job Service code.

Deployment steps:
1. Backup current code
2. Deploy to staging
3. Run smoke tests
4. Deploy to production
5. Monitor logs

Expected change: Add "admin" to ALLOWED_ROLES in RBAC middleware
```

---

## Documentation

### For Users

**Admin Dashboard - Job Monitoring**

If you see a 403 error:
1. This is a backend configuration issue
2. Contact your system administrator
3. They need to update the Job Service to recognize admin roles

### For Developers

See these files for technical details:
- `JOB_SERVICE_AUTH_FIX.md` - Technical explanation
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Implementation guide
- `DEBUG_JOB_SERVICE.md` - Debugging guide
- `SOLUTION_SUMMARY.md` - Quick reference

---

## Success Metrics

- [ ] Admin users can access Job Monitoring
- [ ] No 403 errors for admin users
- [ ] All job service endpoints return 200
- [ ] User/agency roles still work
- [ ] No performance degradation
- [ ] No security issues
- [ ] Logs show admin access correctly

---

## Rollback Plan

If issues occur:

1. **Immediate:** Revert backend changes
2. **Verify:** Test that user/agency roles still work
3. **Investigate:** Check logs for what went wrong
4. **Communicate:** Notify all teams of rollback

---

## Questions?

1. **Frontend:** Check `DEBUG_JOB_SERVICE.md`
2. **Backend:** Check `BACKEND_IMPLEMENTATION_GUIDE.md`
3. **Technical:** Check `JOB_SERVICE_AUTH_FIX.md`
4. **General:** Check `SOLUTION_SUMMARY.md`

---

## Sign-Off

- [ ] Frontend Team: Changes complete and tested
- [ ] Backend Team: Implementation complete and tested
- [ ] QA Team: All tests passed
- [ ] DevOps Team: Deployed to production
- [ ] Product Team: Feature ready for users
