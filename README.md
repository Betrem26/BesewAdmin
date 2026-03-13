# Admin Dashboard - Developer Guide

## Getting Started

### Prerequisites
- Node.js 18.x LTS
- npm 9.x or higher
- Git access to repository
- Backend services running locally (optional for UI-only work)

### Clone & Setup

```bash
# Clone the repository (you'll have GitHub access)
git clone https://github.com/brookgit/bswadminfront.git
cd bswadminfront

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:5173
```

### Available Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Check code quality
npm run format       # Auto-format code
npm run type-check   # Verify TypeScript types
```

---

## Technology Stack

### Frontend Framework
- **React 18** - UI library with hooks and functional components
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript** - Type-safe JavaScript for better DX

### State Management & Data
- **Redux Toolkit** - Predictable state management with slices
- **Axios** - HTTP client for API communication
- **React Query** (optional) - Server state management

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Components** - Atomic design pattern (atoms → molecules → organisms)
- **Chart.js / Recharts** - Data visualization

### Development Tools
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Vite** - Fast HMR (Hot Module Replacement)

### Key Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-redux": "^8.x",
  "@reduxjs/toolkit": "^1.x",
  "axios": "^1.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "vite": "^4.x"
}
```

---

## Design System & Architecture

### Component Architecture (Atomic Design)

```
components/
├── atoms/              # Basic building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── cards/
│       └── HoverRevealCard.tsx
│
├── molecules/          # Simple component groups
│   ├── FormField.tsx
│   ├── SearchBar.tsx
│   └── DataTable.tsx
│
├── organisms/          # Complex component groups
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Modal.tsx
│
├── charts/             # Data visualization
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   └── PieChart.tsx
│
└── psychometric/       # Domain-specific
    ├── ModelManagement.tsx
    └── QuestionBuilder.tsx
```

### Design Principles

1. **Consistency** - Reusable components with consistent styling
2. **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
3. **Responsiveness** - Mobile-first approach with Tailwind breakpoints
4. **Performance** - Code splitting, lazy loading, memoization
5. **Maintainability** - Clear naming, modular structure, documentation

### Color Palette

```css
/* Primary */
--primary: #3B82F6      /* Blue */
--primary-dark: #1E40AF
--primary-light: #DBEAFE

/* Secondary */
--secondary: #10B981    /* Green */
--secondary-dark: #047857
--secondary-light: #D1FAE5

/* Status */
--success: #10B981
--warning: #F59E0B
--error: #EF4444
--info: #3B82F6

/* Neutral */
--gray-50: #F9FAFB
--gray-900: #111827
```

### Typography

```css
/* Headings */
h1: 2.25rem (36px) - Bold
h2: 1.875rem (30px) - Bold
h3: 1.5rem (24px) - Semibold
h4: 1.25rem (20px) - Semibold

/* Body */
body: 1rem (16px) - Regular
small: 0.875rem (14px) - Regular
```

### Spacing System

```css
/* Tailwind scale (4px base) */
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Layout Patterns

**Dashboard Grid**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

**Sidebar + Content**
```tsx
<div className="flex h-screen">
  <Sidebar className="w-64" />
  <main className="flex-1 overflow-auto">
    {/* Content */}
  </main>
</div>
```

**Card Component**
```tsx
<div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
  {/* Content */}
</div>
```

---

## Project Structure

```
src/
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
├── pages/                     # Page components
│   ├── dashboard/
│   │   ├── DashboardHome.tsx
│   │   ├── UserManagement.tsx
│   │   ├── Analytics.tsx
│   │   ├── Psychometric.tsx
│   │   ├── JobMonitoring.tsx
│   │   ├── CandidateManagement.tsx
│   │   ├── CommissionTracking.tsx
│   │   ├── OTPManagement.tsx
│   │   ├── JobCategories.tsx
│   │   ├── AccountReports.tsx
│   │   ├── CustomerSupport.tsx
│   │   ├── AuditLogs.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── SystemHealth.tsx
│   │   ├── ExecutiveDashboard.tsx
│   │   ├── PsychometricAnalytics.tsx
│   │   └── StartupManagement.tsx
│   ├── settings/
│   │   ├── Settings.tsx
│   │   └── MenuManagement.tsx
│   └── RoleManagement.tsx
├── components/                # Reusable components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── charts/
│   ├── psychometric/
│   └── ...
├── services/                  # API services
│   ├── api.ts                # Base API client
│   ├── statisticsApi.ts
│   ├── psychometricApi.ts
│   ├── jobCategoryApi.ts
│   ├── accountReportsApi.ts
│   ├── otpManagementApi.ts
│   ├── customerSupportApi.ts
│   ├── menuConfigApi.ts
│   ├── monitoringApi.ts
│   └── auditLogger.ts
├── store/                     # Redux store
│   ├── store.ts
│   └── features/
│       ├── statisticsSlice.ts
│       ├── psychometricSlice.ts
│       ├── jobCategoriesSlice.ts
│       ├── accountReportsSlice.ts
│       ├── otpManagementSlice.ts
│       ├── customerSupportSlice.ts
│       └── menuConfigSlice.ts
├── layouts/                   # Layout components
│   └── DashboardLayout.tsx
├── utils/                     # Utility functions
│   ├── piiMasking.ts
│   ├── inputValidation.ts
│   ├── rateLimiter.ts
│   ├── rbac.ts
│   ├── errorHandler.ts
│   └── ...
├── styles/                    # Global styles
├── types/                     # TypeScript types
└── constants/                 # Constants

public/
├── index.html
└── assets/
```

---

## Environment Configuration

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:1201
VITE_ACCOUNT_SERVICE=http://localhost:1201
VITE_CANDIDATE_SERVICE=http://localhost:1202
VITE_PARTY_SERVICE=http://localhost:1205
VITE_JOB_SERVICE=http://localhost:1250
VITE_NOTIFICATION_SERVICE=http://localhost:1206
VITE_COMMISSION_SERVICE=http://localhost:1207
VITE_PSYCHOMETRIC_SERVICE=http://localhost:1211
VITE_SEARCH_SERVICE=http://localhost:1208
VITE_REFERENCE_SERVICE=http://localhost:1209
VITE_CAREER_INTELLIGENCE_SERVICE=http://localhost:1212
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run type-check      # Check TypeScript types
npm run test            # Run tests (if configured)
```

---

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **UI Components**: Custom + Tailwind CSS
- **Charts**: Chart.js / Recharts
- **Styling**: Tailwind CSS

---

## Key Features

### Dashboard Modules

1. **User Management** - Manage admin users and roles
2. **Analytics** - View system statistics and metrics
3. **Psychometric** - Manage psychometric assessments
4. **Job Monitoring** - Track job postings and applications
5. **Candidate Management** - View candidate profiles
6. **Commission Tracking** - Monitor commission calculations
7. **OTP Management** - Manage OTP settings
8. **Job Categories** - Configure job categories
9. **Account Reports** - Generate account reports
10. **Customer Support** - Handle support tickets
11. **Audit Logs** - View system audit logs
12. **Notification Center** - Manage notifications
13. **System Health** - Monitor system status
14. **Executive Dashboard** - High-level overview
15. **Psychometric Analytics** - Assessment analytics
16. **Startup Management** - Manage startup profiles

### Settings

- **Menu Management** - Configure dynamic menu
- **Role Management** - Define user roles
- **General Settings** - System configuration

---

## API Integration

### Base API Client

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Service Example

```typescript
// services/statisticsApi.ts
import api from './api';

export const getAccountStats = async () => {
  const response = await api.get('/account/stats');
  return response.data;
};

export const getCandidateStats = async () => {
  const response = await api.get('/candidate/stats');
  return response.data;
};
```

---

## State Management (Redux)

### Creating a Slice

```typescript
// store/features/exampleSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchData = createAsyncThunk(
  'example/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/endpoint');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const exampleSlice = createSlice({
  name: 'example',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default exampleSlice.reducer;
```

### Using in Components

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../store/features/exampleSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.example);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* render data */}</div>;
}
```

---

## Component Development

### Functional Component Example

```typescript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  title: string;
  onClose?: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onClose }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.example.data);

  useEffect(() => {
    // Component logic
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

---

## Styling

### Tailwind CSS

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

### Custom CSS

```css
/* styles/custom.css */
.dashboard-card {
  @apply p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow;
}
```

---

## Error Handling

### Global Error Handler

```typescript
// utils/errorHandler.ts
export const handleError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    console.error('Error:', error.response.data);
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server';
  } else {
    // Error in request setup
    return error.message;
  }
};
```

### Using in Components

```typescript
try {
  await api.post('/endpoint', data);
} catch (error) {
  const message = handleError(error);
  showNotification(message, 'error');
}
```

---

## Security

### PII Masking

```typescript
// utils/piiMasking.ts
export const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  return `${name.substring(0, 2)}***@${domain}`;
};

export const maskPhone = (phone: string) => {
  return `***-***-${phone.slice(-4)}`;
};
```

### Input Validation

```typescript
// utils/inputValidation.ts
export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string) => {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
};
```

### Rate Limiting

```typescript
// utils/rateLimiter.ts
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests: number[] = [];

  return () => {
    const now = Date.now();
    const recentRequests = requests.filter((time) => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    requests.push(now);
    return true;
  };
};
```

---

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## Deployment

### Build

```bash
npm run build
# Creates optimized dist/ folder
```

### Docker

```bash
# Build Docker image
docker build -f Dockerfile.production -t besew-admin-dashboard:latest .

# Run container
docker run -d \
  --name besew-admin-dashboard \
  --network backend_besew-network \
  -p 3000:80 \
  besew-admin-dashboard:latest
```

### GitHub Actions

Push to main branch triggers automatic deployment:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

Workflow automatically:
1. Builds Docker image
2. Transfers to jumphost
3. Deploys container
4. Reloads NGINX

Access at: https://admin.besewonline.com

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

### npm Install Issues

```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -r node_modules package-lock.json

# Reinstall
npm install
```

### API Connection Issues

1. Verify backend services are running
2. Check `.env.local` URLs
3. Check browser console for CORS errors
4. Verify JWT token in localStorage

### Build Errors

```bash
# Check TypeScript errors
npm run type-check

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## Performance Tips

1. Use React.memo for expensive components
2. Implement code splitting with React.lazy
3. Optimize images and assets
4. Use Redux selectors efficiently
5. Implement pagination for large lists
6. Cache API responses appropriately

---

## Code Style

### ESLint & Prettier

```bash
# Format code
npm run format

# Check linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Naming Conventions

- Components: PascalCase (MyComponent.tsx)
- Functions: camelCase (myFunction)
- Constants: UPPER_SNAKE_CASE (MY_CONSTANT)
- Files: kebab-case (my-component.tsx)

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main
```

---

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Axios Documentation](https://axios-http.com/)

---

## Support

For issues or questions:
1. Check existing documentation
2. Review code comments
3. Check GitHub Issues
4. Ask team members

---

**Last Updated**: March 13, 2026
**Version**: 1.0


---

## GitHub Collaboration Workflow

### Branch Strategy

```bash
# Main branch - production ready
main

# Feature branches
feature/user-management
feature/analytics-dashboard
feature/psychometric-config

# Bug fixes
bugfix/login-issue
bugfix/data-validation

# Hotfixes
hotfix/critical-bug
```

### Commit & Push Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve issue"
git commit -m "refactor: improve code"
git commit -m "docs: update documentation"

# 3. Push to GitHub
git push origin feature/your-feature-name

# 4. Create Pull Request on GitHub
# - Add description
# - Link related issues
# - Request reviewers

# 5. After approval, merge to main
# GitHub Actions automatically:
# - Builds Docker image
# - Deploys to jumphost
# - Updates admin.besewonline.com
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation
- `style` - Formatting (no logic change)
- `test` - Adding tests
- `chore` - Build, dependencies

**Examples:**
```
feat(dashboard): add user statistics widget
fix(auth): resolve token expiration issue
refactor(api): simplify error handling
docs(readme): update setup instructions
```

### Pull Request Checklist

- [ ] Code follows project style guide
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] TypeScript types are correct
- [ ] Changes are documented
- [ ] Commit messages are clear
- [ ] No breaking changes (or documented)

---

## Automatic Deployment

When you push to `main` branch:

1. **GitHub Actions Workflow Triggers**
   - Builds Docker image with Vite
   - Runs linting and type checks
   - Transfers code to jumphost

2. **Jumphost Deployment**
   - Builds optimized production image
   - Stops old container
   - Starts new container on port 3000
   - Reloads NGINX

3. **Live Access**
   - URL: https://admin.besewonline.com
   - Automatic SSL via Let's Encrypt
   - Health checks verify deployment

**Deployment Status:** Check GitHub Actions tab in repository

---

## Quick Development Tips

### Hot Reload Development
```bash
npm run dev
# Changes auto-reload in browser
# No need to restart server
```

### Type Safety
```bash
npm run type-check
# Run before committing to catch TypeScript errors
```

### Code Quality
```bash
npm run lint -- --fix
npm run format
# Auto-fix linting and formatting issues
```

### Testing Locally
```bash
# Test with production build
npm run build
npm run preview
# Access at http://localhost:4173
```

### Environment Variables
Create `.env.local` for local development:
```env
VITE_API_URL=http://localhost:1201
VITE_ACCOUNT_SERVICE=http://localhost:1201
VITE_CANDIDATE_SERVICE=http://localhost:1202
VITE_PARTY_SERVICE=http://localhost:1205
VITE_JOB_SERVICE=http://localhost:1250
```

---

## Common Tasks

### Add New Dashboard Page

1. Create component in `src/pages/dashboard/`
2. Add Redux slice in `src/store/features/`
3. Create API service in `src/services/`
4. Add route in `src/App.tsx`
5. Update sidebar navigation
6. Commit and push

### Add New API Integration

1. Create service in `src/services/`
2. Define types in `src/types/`
3. Create Redux slice for state
4. Use in component with `useDispatch` and `useSelector`
5. Handle loading and error states

### Update Styling

- Use Tailwind classes for consistency
- Avoid inline styles
- Create reusable component variants
- Test responsive breakpoints

### Fix Bugs

1. Create `bugfix/` branch
2. Reproduce issue locally
3. Write fix with clear commit message
4. Test thoroughly
5. Create PR with issue reference
6. Merge after review

---

## Troubleshooting

### Port 5173 Already in Use
```bash
# Find and kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### npm Install Fails
```bash
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run type-check
# Review errors and fix
```

### Build Fails
```bash
npm run lint
npm run type-check
npm run build
# Check error messages
```

### Deployment Not Working
1. Check GitHub Actions logs
2. Verify commit is on main branch
3. Check `.github/workflows/sync-admin-to-jumphost.yml`
4. Verify Docker image builds locally

---

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios Documentation](https://axios-http.com/)

---

## Support & Questions

1. Check existing documentation
2. Review similar components in codebase
3. Check GitHub Issues
4. Ask team members in discussions
5. Create issue if bug found

---

**Repository:** https://github.com/brookgit/bswadminfront
**Production:** https://admin.besewonline.com
**Last Updated:** March 13, 2026
