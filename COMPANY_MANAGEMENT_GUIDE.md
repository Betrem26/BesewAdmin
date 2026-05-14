# Company Management Dashboard - Implementation Guide

## Overview

The Company Management section has been added to the Admin Dashboard, providing comprehensive tools for managing registered companies, viewing their details, and managing company culture attributes.

## Features Implemented

### 1. Global Company List
- **Endpoint:** `GET /company-data`
- **Features:**
  - Display all registered companies in a sortable, filterable table
  - Show company logo, name, type, location, and key metrics
  - Filter by posting frequency (daily, weekly, monthly)
  - Filter by career page availability
  - Search by company name or location
  - Export company data to CSV

### 2. Company Statistics Dashboard
- **Cards displayed:**
  - Total Companies count
  - Startups count
  - Enterprises count
  - Companies with Career Pages count

### 3. Company Detail View
- **Endpoint:** `GET /company-data/company/{id}`
- **Displays:**
  - Basic Information (name, type, description, license, TIN)
  - Location & Contact (address, city, region, phone, website)
  - Operations (employees, vacancies, posting frequency, career page)
  - Culture & Values (mission, vision, values, culture attributes)

### 4. Culture Management
- **View Culture:** `GET /company-data/culture/{id}`
- **Regenerate with AI:** `POST /company-data/culture/generate-and-save`
- **Features:**
  - Display company mission and vision
  - Show core values and culture attributes
  - One-click AI regeneration of culture attributes
  - Automatic save after regeneration

### 5. Logo Management
- **Upload Logo:** `PUT /company-data/company-logo/{id}`
- **Features:**
  - Preview current logo
  - Upload new logo (JPG, PNG, max 5MB)
  - Automatic file validation
  - Success/error notifications

## File Structure

```
src/
├── pages/dashboard/
│   └── CompanyManagement.tsx          # Main company list page
├── components/
│   └── CompanyDetailModal.tsx         # Company detail modal
├── App.tsx                             # Updated with route
└── layouts/
    └── DashboardLayout.tsx            # Updated sidebar menu
```

## API Endpoints Used

### Company Data
```
GET    /company-data                    # List all companies
GET    /company-data/company/{id}       # Get company details
PUT    /company-data/company/{id}       # Update company
DELETE /company-data/{id}               # Delete company
PUT    /company-data/company-logo/{id}  # Upload logo
```

### Culture Management
```
GET    /company-data/culture/{id}                      # Get culture
POST   /company-data/culture/generate                  # Generate culture
POST   /company-data/culture/generate-and-save         # Generate & save
```

## Component Details

### CompanyManagement.tsx

**Main Features:**
- Company list with filtering and search
- Statistics cards showing key metrics
- Export functionality
- Modal integration for detail view

**State Management:**
```typescript
- companies: Company[]              // All companies
- filteredCompanies: Company[]      // Filtered results
- loading: boolean                  // Loading state
- error: string | null              // Error messages
- selectedCompany: Company | null   // Selected for modal
- modalOpen: boolean                // Modal visibility
- searchQuery: string               // Search filter
- frequencyFilter: string           // Posting frequency filter
- careerPageFilter: string          // Career page filter
- stats: CompanyStats               // Statistics
```

**Key Functions:**
- `loadCompanies()` - Fetch companies from API
- `calculateStats()` - Calculate statistics
- `filterCompanies()` - Apply filters and search
- `handleExport()` - Export to CSV
- `handleViewCompany()` - Open detail modal

### CompanyDetailModal.tsx

**Main Features:**
- Display company details in organized sections
- Culture attributes with AI regeneration
- Logo upload with preview
- Success/error notifications

**Sections:**
1. Basic Information
2. Location & Contact
3. Operations
4. Culture & Values
5. Logo Management

**Key Functions:**
- `handleLogoUpload()` - Upload company logo
- `handleRegenerateCulture()` - Regenerate culture with AI

## Usage

### Accessing Company Management

1. Navigate to Dashboard
2. Click "Companies" in the Business section of the sidebar
3. View the company list with statistics

### Filtering Companies

**By Posting Frequency:**
- Select from dropdown: All, Daily, Weekly, Monthly

**By Career Page:**
- Select from dropdown: All Companies, Has Career Page, No Career Page

**By Search:**
- Type company name or location in search box

### Viewing Company Details

1. Click the eye icon in the Actions column
2. Modal opens with full company information
3. View culture attributes and mission/vision
4. Upload new logo if needed
5. Regenerate culture attributes with AI

### Uploading Company Logo

1. Open company detail modal
2. Scroll to "Logo Management" section
3. Click "Upload Logo" button
4. Select JPG or PNG file (max 5MB)
5. Logo updates automatically

### Regenerating Culture Attributes

1. Open company detail modal
2. Scroll to "Culture & Values" section
3. Click "Re-generate with AI" button
4. Wait for AI to generate new attributes
5. Culture attributes update automatically

### Exporting Company Data

1. Apply filters as needed
2. Click "Export" button in header
3. CSV file downloads with filtered data

## Data Structure

### Company Interface
```typescript
interface Company {
  _id?: string;
  company_id?: string;
  company_name: string;
  company_type?: { name: string };
  company_level?: { name: string };
  logo?: string;
  location?: string;
  city?: string;
  region?: string;
  company_description?: string;
  posting_frequency?: string;
  has_career_page?: boolean;
  career_page_url?: string;
  total_employee?: number;
  total_vacancy?: number;
  mission?: string;
  vision?: string;
  values?: string[];
  culture_attributes?: string[];
  liscence_number?: string;
  tin_number?: string;
  phone_number?: string;
  website?: string;
  specialized_in?: string;
}
```

## Styling

### Color Scheme
- **Startups:** Green (#d4edda)
- **Enterprises:** Blue (#cfe2ff)
- **Agencies:** Yellow (#fff3cd)
- **Daily:** Cyan (#d1ecf1)
- **Weekly:** Purple (#e7d4f5)
- **Monthly:** Red (#f8d7da)

### Responsive Design
- Desktop: Full sidebar + content
- Tablet: Collapsible sidebar
- Mobile: Hidden sidebar with menu button

## Error Handling

### API Errors
- Display error message in red banner
- Show specific error details from API
- Allow retry with refresh button

### File Upload Errors
- Validate file type (JPG, PNG only)
- Validate file size (max 5MB)
- Show error message in modal

### Network Errors
- Display connection error message
- Provide retry option
- Log errors to console

## Performance Considerations

### Optimization
- Lazy load company logos
- Paginate large company lists (limit: 1000)
- Cache company data in state
- Debounce search input

### Loading States
- Show loading message while fetching
- Disable buttons during operations
- Show spinner on logo upload

## Security

### Data Protection
- Only authenticated users can access
- Admin role required
- JWT token validation
- CORS headers configured

### File Upload
- Validate file type on frontend
- Validate file size (max 5MB)
- Backend validates on server
- Secure file storage

## Testing

### Manual Testing Checklist
- [ ] Load company list
- [ ] Filter by posting frequency
- [ ] Filter by career page
- [ ] Search by company name
- [ ] Search by location
- [ ] Export to CSV
- [ ] Open company detail modal
- [ ] View culture attributes
- [ ] Upload company logo
- [ ] Regenerate culture with AI
- [ ] Test error handling
- [ ] Test on mobile/tablet

### Test Data
- Create test companies with different types
- Test with various posting frequencies
- Test with and without career pages
- Test with and without logos

## Future Enhancements

### Planned Features
1. **Edit Company:** Allow admins to edit company details
2. **Delete Company:** Confirm deletion with warning
3. **Bulk Actions:** Select multiple companies for bulk operations
4. **Advanced Filters:** Filter by company level, ownership type
5. **Company Analytics:** Show job posting trends, application rates
6. **Verification Status:** Show company verification status
7. **Funding Information:** Display startup funding details
8. **Team Information:** Show company team members

### API Endpoints to Implement
```
PUT    /company-data/company/{id}       # Update company
DELETE /company-data/{companyId}        # Delete company
POST   /company-data/set-culture        # Set culture manually
```

## Troubleshooting

### Companies Not Loading
1. Check API endpoint is correct
2. Verify authentication token
3. Check browser console for errors
4. Verify network connection

### Logo Upload Fails
1. Check file size (max 5MB)
2. Check file type (JPG, PNG only)
3. Verify file is not corrupted
4. Check API endpoint permissions

### Culture Regeneration Fails
1. Check company has description
2. Verify LLM service is running
3. Check API endpoint permissions
4. Review error message in modal

### Filters Not Working
1. Refresh page
2. Clear search query
3. Reset filters to "All"
4. Check API response format

## Support

For issues or questions:
1. Check this guide
2. Review error messages
3. Check browser console
4. Contact backend team
5. Review API documentation

## Related Documentation

- [Job Service Auth Fix](./JOB_SERVICE_AUTH_FIX.md)
- [Backend Implementation Guide](./BACKEND_IMPLEMENTATION_GUIDE.md)
- [API Documentation](./API_DOCS.md)
