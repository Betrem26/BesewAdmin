# Haye Fintax Admin Dashboard - Comprehensive UI Redesign Plan

## Overview
This document outlines the complete redesign of the admin dashboard to provide comprehensive management capabilities across all microservices.

## Current State Analysis
- **Tech Stack**: React 18 + Vite + TypeScript + Redux Toolkit + Styled Components
- **UI Libraries**: Chakra UI, Material-UI, Framer Motion
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM v6
- **Current Login**: Fixed to use `/auth/login` endpoint

## Discovered Admin Endpoints

### 1. Account Service Admin Endpoints
**Base URL**: `https://account.besewonline.com`

#### OTP Management (`/admin/otp`)
- `POST /admin/otp/reset-rate-limit` - Reset OTP rate limit for blocked phone numbers
- `GET /admin/otp/rate-limit-status?phoneNumber={phone}` - Check rate limit status
- `GET /admin/otp/blocked-numbers` - Get list of blocked phone numbers

#### Rate Limit Management (`/admin/rate-limit`)
- `POST /admin/rate-limit/reset` - Reset rate limit for blocked users

#### Customer Support (`/customer-support/admin`)
- `GET /customer-support/admin` - List all support tickets
- `GET /customer-support/admin/:id` - View specific ticket
- `PUT /customer-support/admin/:id/status` - Update ticket status
- `DELETE /customer-support/admin/:id` - Delete ticket

#### Account Reports (`/account-report/admin`)
- `GET /account-report/admin` - List all account reports
- `GET /account-report/admin/:id` - View specific report
- `PUT /account-report/admin/:id/status` - Update report status
- `DELETE /account-report/admin/:id` - Delete report

### 2. Job Service Admin Endpoints
**Base URL**: `https://jobs.besewonline.com`

#### Job Categories (`/job-category`)
- `GET /job-category/adminCategory` - Get admin-added categories
- `POST /job-category` - Create new job category (with icon upload)
- `PUT /job-category/:id` - Update job category
- `DELETE /job-category/:id` - Delete job category

### 3. Psychometric Service Admin Endpoints
**Base URL**: `https://psychometric.besewonline.com`

#### AI Question Management (`/admin/ai`)
- `POST /admin/ai/generate-questions` - Generate new psychometric questions using AI
- `POST /admin/questions/review` - Review and validate questions

### 4. Additional Services to Check
- **Employee Service**: Check for admin endpoints
- **Candidate Service**: Check for admin endpoints
- **Party Service**: Check for admin endpoints
- **Commission Service**: Check for admin endpoints

## Proposed Admin Dashboard Structure

### Navigation Menu

```
├── Dashboard (Home)
│   ├── Overview Statistics
│   ├── Recent Activity
│   └── Quick Actions
│
├── User Management
│   ├── All Users
│   ├── Role Management
│   ├── User Reports
│   └── Trust Ratings
│
├── Customer Support
│   ├── All Tickets
│   ├── Open Tickets
│   ├── Resolved Tickets
│   └── Ticket Categories
│
├── Security & Monitoring
│   ├── OTP Management
│   │   ├── Blocked Numbers
│   │   ├── Rate Limit Status
│   │   └── Reset Rate Limits
│   ├── Account Reports
│   │   ├── All Reports
│   │   ├── Pending Reports
│   │   └── Resolved Reports
│   └── Security Logs
│
├── Job Management
│   ├── Job Categories
│   │   ├── All Categories
│   │   ├── Admin Categories
│   │   └── Create Category
│   ├── Job Posts
│   └── Job Applications
│
├── Psychometric Management
│   ├── Question Bank
│   ├── AI Question Generator
│   ├── Question Review
│   └── Assessment Analytics
│
├── Content Management
│   ├── Special Offers
│   ├── Privacy Policy
│   └── Terms of Service
│
└── Settings
    ├── Admin Profile
    ├── System Configuration
    └── Audit Logs
```

## Page Designs

### 1. Dashboard Home
**Components:**
- Statistics Cards (Total Users, Active Tickets, Pending Reports, etc.)
- Recent Activity Timeline
- Quick Action Buttons
- Charts (User Growth, Ticket Resolution Rate, etc.)

### 2. Customer Support Management
**Features:**
- Ticket List with Filters (Status, Category, Date)
- Ticket Detail View
- Status Update Modal
- Notes/Comments Section
- Ticket Assignment
- Priority Management

**Table Columns:**
- Ticket ID
- Subject
- Category
- Status (Open, In Progress, Resolved, Closed)
- Reporter (Party ID, Phone)
- Created Date
- Last Updated
- Actions (View, Update Status, Delete)

### 3. OTP & Rate Limit Management
**Features:**
- Blocked Numbers List
- Search by Phone Number
- Rate Limit Status Checker
- Reset Rate Limit Action
- Activity Log

**Components:**
- Search Bar (Phone Number)
- Blocked Numbers Table
- Rate Limit Status Card
- Reset Confirmation Modal

### 4. Account Reports Management
**Features:**
- Reports List with Filters
- Report Detail View
- Status Update
- Trust Rating Calculator
- Report Categories

**Table Columns:**
- Report ID
- Reported Party ID
- Reporter Party ID
- Type (Fraud, Abuse, Spam, etc.)
- Status (Pending, Under Review, Resolved, Dismissed)
- Description
- Created Date
- Actions

### 5. Job Category Management
**Features:**
- Category List (Grid/Table View)
- Create Category Form (with Icon Upload)
- Edit Category
- Delete Category
- Language Options (English, Amharic, Oromiffa)
- Company Type Filter

**Form Fields:**
- Category Name (Multi-language)
- Description
- Icon Upload
- Company Type
- Language Options
- Active Status

### 6. Psychometric Question Management
**Features:**
- Question Bank Browser
- AI Question Generator
- Question Review Interface
- Metadata Editor (Factor Loading, Cultural Sensitivity, Bias Risk)
- Question Preview

**AI Generator Form:**
- Model/Trait Selection
- Question Count
- Difficulty Level
- Profile Context (Education, Skills, Location)

## Technical Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
1. **API Service Layer**
   - Create centralized API service with axios
   - Implement JWT token management
   - Add request/response interceptors
   - Error handling and retry logic

2. **Redux Store Structure**
   ```typescript
   store/
   ├── features/
   │   ├── userSlice.ts (existing)
   │   ├── customerSupportSlice.ts
   │   ├── otpManagementSlice.ts
   │   ├── accountReportsSlice.ts
   │   ├── jobCategoriesSlice.ts
   │   └── psychometricSlice.ts
   └── api/
       ├── accountApi.ts
       ├── jobApi.ts
       └── psychometricApi.ts
   ```

3. **Routing Setup**
   ```typescript
   routes/
   ├── ProtectedRoute.tsx
   ├── AdminRoute.tsx
   └── index.tsx
   ```

### Phase 2: Customer Support Module (Week 2)
1. **Components**
   - TicketList.tsx
   - TicketDetail.tsx
   - TicketFilters.tsx
   - StatusUpdateModal.tsx
   - TicketStats.tsx

2. **API Integration**
   - Fetch all tickets
   - View ticket details
   - Update ticket status
   - Delete ticket

### Phase 3: Security & Monitoring Module (Week 3)
1. **OTP Management**
   - BlockedNumbersList.tsx
   - RateLimitChecker.tsx
   - ResetRateLimitModal.tsx

2. **Account Reports**
   - ReportsList.tsx
   - ReportDetail.tsx
   - ReportFilters.tsx
   - StatusUpdateModal.tsx

### Phase 4: Job Management Module (Week 4)
1. **Job Categories**
   - CategoryList.tsx
   - CategoryForm.tsx (Create/Edit)
   - CategoryCard.tsx
   - IconUploader.tsx

2. **API Integration**
   - CRUD operations for categories
   - File upload for icons
   - Multi-language support

### Phase 5: Psychometric Module (Week 5)
1. **Question Management**
   - QuestionBank.tsx
   - AIQuestionGenerator.tsx
   - QuestionReview.tsx
   - QuestionPreview.tsx

2. **API Integration**
   - Generate questions with AI
   - Review and validate questions
   - Update question metadata

### Phase 6: Dashboard & Analytics (Week 6)
1. **Dashboard Components**
   - StatisticsCards.tsx
   - ActivityTimeline.tsx
   - QuickActions.tsx
   - Charts (using recharts)

2. **Analytics**
   - User growth charts
   - Ticket resolution metrics
   - Report statistics
   - System health indicators

## UI/UX Design Guidelines

### Color Scheme
```css
:root {
  --primary: #007bff;
  --primary-dark: #0056b3;
  --secondary: #6c757d;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
  --light: #f8f9fa;
  --dark: #343a40;
  --background: #ffffff;
  --sidebar: #2c3e50;
  --sidebar-hover: #34495e;
}
```

### Typography
- **Headings**: Inter, sans-serif
- **Body**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- **Monospace**: "Courier New", monospace (for IDs, codes)

### Component Library Usage
- **Chakra UI**: Primary component library for forms, modals, alerts
- **Material-UI**: Data tables, complex components
- **Styled Components**: Custom styling and theming
- **Framer Motion**: Page transitions and animations

### Responsive Design
- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation bar

## API Service Implementation

### Base API Service
```typescript
// services/api.ts
import axios from 'axios';
import { store } from '../store';

const API_ENDPOINTS = {
  account: 'https://account.besewonline.com',
  job: 'https://jobs.besewonline.com',
  psychometric: 'https://psychometric.besewonline.com',
  candidate: 'https://candidate.besewonline.com',
  party: 'https://party.besewonline.com',
  commission: 'https://commission.besewonline.com',
};

const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add JWT token
  client.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.user.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired - redirect to login
        store.dispatch({ type: 'user/logout' });
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const accountApi = createApiClient(API_ENDPOINTS.account);
export const jobApi = createApiClient(API_ENDPOINTS.job);
export const psychometricApi = createApiClient(API_ENDPOINTS.psychometric);
```

### Customer Support API
```typescript
// services/customerSupportApi.ts
import { accountApi } from './api';

export interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  partyId: string;
  phone_number: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export const customerSupportApi = {
  getAllTickets: () => 
    accountApi.get<SupportTicket[]>('/customer-support/admin'),
  
  getTicket: (id: string) => 
    accountApi.get<SupportTicket>(`/customer-support/admin/${id}`),
  
  updateTicketStatus: (id: string, data: { status: string; adminNotes?: string }) =>
    accountApi.put(`/customer-support/admin/${id}/status`, data),
  
  deleteTicket: (id: string) =>
    accountApi.delete(`/customer-support/admin/${id}`),
};
```

## Security Considerations

### Authentication
- JWT token stored in Redux with persistence
- Token refresh mechanism
- Automatic logout on token expiration
- Role-based access control (admin role required)

### Authorization
- Admin guard on all admin routes
- API endpoints protected with JWT + Admin role
- Sensitive actions require confirmation modals

### Data Protection
- No sensitive data in localStorage (only encrypted tokens)
- HTTPS for all API calls
- Input validation on all forms
- XSS protection with proper escaping

## Testing Strategy

### Unit Tests
- Component rendering tests
- Redux slice tests
- API service tests
- Utility function tests

### Integration Tests
- User flow tests (login → navigate → perform action)
- API integration tests
- Form submission tests

### E2E Tests
- Critical admin workflows
- Customer support ticket management
- OTP rate limit reset
- Job category CRUD operations

## Deployment Plan

### Build Configuration
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

### Environment Variables
```env
VITE_API_ACCOUNT_URL=https://account.besewonline.com
VITE_API_JOB_URL=https://jobs.besewonline.com
VITE_API_PSYCHOMETRIC_URL=https://psychometric.besewonline.com
VITE_API_CANDIDATE_URL=https://candidate.besewonline.com
VITE_API_PARTY_URL=https://party.besewonline.com
VITE_API_COMMISSION_URL=https://commission.besewonline.com
```

### Docker Deployment
- Multi-stage build (same as current)
- NGINX serving static files
- Environment variable injection at runtime

## Success Metrics

### Performance
- Page load time < 2 seconds
- API response time < 500ms
- Smooth animations (60fps)

### Usability
- Admin can complete common tasks in < 3 clicks
- Clear error messages and feedback
- Intuitive navigation

### Functionality
- All admin endpoints integrated
- Real-time data updates
- Comprehensive filtering and search

## Next Steps

1. **Immediate**: Review and approve this plan
2. **Week 1**: Set up core infrastructure and API services
3. **Week 2-6**: Implement modules according to phased plan
4. **Week 7**: Testing and bug fixes
5. **Week 8**: Deployment and documentation

## Questions for Stakeholders

1. Are there additional admin endpoints in other services we should include?
2. What are the priority modules (which should we build first)?
3. Are there specific analytics or reports needed?
4. What level of access control granularity is required?
5. Should we implement audit logging for admin actions?
