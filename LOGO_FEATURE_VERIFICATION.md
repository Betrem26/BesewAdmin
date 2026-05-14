# Logo Editing Feature - Verification Guide

## Quick Test Steps

### Test 1: Logo Preview with Camera Icon
1. Navigate to `/dashboard/company-management`
2. Click on any company row to open the detail modal
3. Look at the sidebar "Logo" section
4. **Expected**: 
   - ✅ Logo displays in circular format
   - ✅ Camera icon appears on hover
   - ✅ Two buttons: "Upload File" and "Edit URL"

### Test 2: Edit Logo via URL
1. Click the camera icon or "Edit URL" button
2. **Expected**: 
   - ✅ Modal opens with title "Edit Logo URL"
   - ✅ Circular preview shows current logo
   - ✅ URL input field is visible
   - ✅ Cancel and Update buttons present

3. Enter a valid image URL (e.g., `https://via.placeholder.com/200`)
4. **Expected**:
   - ✅ Preview updates in real-time
   - ✅ Image displays in circular container

5. Click "Update Logo"
6. **Expected**:
   - ✅ Loading spinner appears
   - ✅ Button shows "Updating..."
   - ✅ Success message appears: "Logo updated successfully!"
   - ✅ Modal closes automatically
   - ✅ Logo updates in sidebar immediately
   - ✅ No page reload needed

### Test 3: Upload Logo via File
1. Click "Upload File" button
2. **Expected**: File picker opens
3. Select a JPG or PNG image
4. **Expected**:
   - ✅ File uploads
   - ✅ Success message appears
   - ✅ Logo updates in modal
   - ✅ Logo updates on dashboard

### Test 4: Error Handling
1. Click "Edit URL" button
2. Leave URL empty and click "Update Logo"
3. **Expected**: 
   - ✅ Error message: "Please enter a valid logo URL"
   - ✅ Update button remains disabled

4. Enter invalid URL (e.g., `not-a-url`)
5. Click "Update Logo"
6. **Expected**:
   - ✅ Error message displays
   - ✅ Modal stays open for retry

### Test 5: Instant Refresh
1. Update logo via URL
2. Close modal
3. Reopen same company
4. **Expected**:
   - ✅ New logo displays
   - ✅ No manual refresh needed
   - ✅ Parent component updated

### Test 6: Responsive Design
1. Test on desktop (1200px+)
   - ✅ Modal displays correctly
   - ✅ Circular preview visible
   - ✅ All buttons accessible

2. Test on tablet (768px-1024px)
   - ✅ Modal adapts to screen
   - ✅ Inputs remain usable
   - ✅ Preview visible

3. Test on mobile (< 768px)
   - ✅ Modal full-width
   - ✅ Buttons stack properly
   - ✅ Touch-friendly sizes

## API Verification

### Endpoint Called
```
PUT https://stage-party.besewonline.com/platform-admin/companies/{companyId}
```

### Request Body
```json
{
  "logo": "https://example.com/logo.png"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Company updated successfully",
  "data": {
    "company_id": "...",
    "logo": "https://example.com/logo.png",
    ...
  }
}
```

### Status Codes
- ✅ 200 OK: Logo updated successfully
- ❌ 400 Bad Request: Invalid URL or data
- ❌ 401 Unauthorized: Not authenticated
- ❌ 403 Forbidden: No permission
- ❌ 404 Not Found: Company not found
- ❌ 500 Server Error: Backend error

## Browser Console Checks

### Check 1: No Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. **Expected**: No red error messages

### Check 2: Network Requests
1. Open Network tab
2. Update logo via URL
3. **Expected**:
   - ✅ PUT request to `/platform-admin/companies/{id}`
   - ✅ Status: 200 OK
   - ✅ Response contains updated logo URL

### Check 3: State Updates
1. Open React DevTools
2. Select CompanyDetailRefactored component
3. Update logo
4. **Expected**:
   - ✅ `localCompany.logo` updates immediately
   - ✅ `showLogoEdit` becomes false
   - ✅ `logoLoading` becomes false

## Feature Checklist

### Logo Preview
- [ ] Circular logo display (120x120px)
- [ ] Camera icon overlay on hover
- [ ] Fallback icon when no logo
- [ ] Smooth transitions

### Edit Modal
- [ ] Modal opens on button click
- [ ] Modal closes on cancel
- [ ] Modal closes on backdrop click
- [ ] Circular preview in modal
- [ ] URL input field
- [ ] Real-time preview update
- [ ] Loading spinner during update
- [ ] Success/error messages

### Buttons
- [ ] "Upload File" button works
- [ ] "Edit URL" button works
- [ ] Camera icon clickable
- [ ] Buttons disable during loading
- [ ] Update button disabled when URL empty

### API Integration
- [ ] Correct endpoint called
- [ ] Correct request body sent
- [ ] JWT token included
- [ ] Response handled correctly
- [ ] Errors displayed to user

### State Management
- [ ] Local state updates immediately
- [ ] Parent component notified
- [ ] No unnecessary re-renders
- [ ] Modal state managed correctly
- [ ] Loading state managed

### User Experience
- [ ] No page reload needed
- [ ] Instant visual feedback
- [ ] Clear error messages
- [ ] Loading indicators
- [ ] Smooth animations
- [ ] Responsive on all devices

## Success Criteria

✅ **All tests pass** if:
1. Logo updates via URL successfully
2. Logo updates via file upload successfully
3. Instant refresh without page reload
4. Error messages display correctly
5. Modal opens/closes smoothly
6. Responsive on all devices
7. No console errors
8. API calls correct endpoint
9. JWT token sent with request
10. Success message appears

## Troubleshooting

### Logo doesn't update
- [ ] Check browser console for errors
- [ ] Verify API endpoint is correct
- [ ] Check JWT token is valid
- [ ] Verify company ID is correct
- [ ] Check network tab for failed requests

### Modal doesn't open
- [ ] Check if `showLogoEdit` state is updating
- [ ] Verify click handlers are attached
- [ ] Check for JavaScript errors in console

### Preview doesn't show
- [ ] Verify image URL is valid
- [ ] Check CORS settings
- [ ] Try different image URL
- [ ] Check browser console for image load errors

### Update button disabled
- [ ] Verify URL field is not empty
- [ ] Check if `logoLoading` is true
- [ ] Verify URL format is correct

## Performance Notes

- Modal renders only when `showLogoEdit` is true
- Image preview uses native browser rendering
- No unnecessary API calls
- Efficient state updates
- Smooth CSS animations (no JavaScript animations)

## Security Considerations

✅ **Implemented:**
- JWT token authentication
- URL validation
- File type validation (JPG, PNG only)
- Error handling without exposing sensitive data
- CORS protection via backend

## Accessibility

✅ **Features:**
- Semantic HTML structure
- Proper label associations
- Keyboard navigation support
- Focus states visible
- Error messages announced
- Loading states indicated
- Alt text for images
- Sufficient color contrast

## Next Steps

After verification:
1. ✅ Confirm all tests pass
2. ✅ Check browser compatibility
3. ✅ Test with different image sizes
4. ✅ Test with slow network (DevTools throttling)
5. ✅ Get user feedback
6. ✅ Deploy to production
