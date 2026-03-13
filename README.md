# Admin Dashboard - Developer Guide

## Local Development Setup (Windows)

### System Requirements

**Minimum:**
- Windows 10 or Windows 11
- 8GB RAM (16GB recommended)
- 5GB free disk space
- Administrator access for npm global packages

**Recommended:**
- Windows 11 Pro
- 16GB+ RAM
- SSD with 10GB+ free space
- Visual Studio Code or similar IDE

### Step 1: Install Node.js

1. Download Node.js 18.x LTS from [nodejs.org](https://nodejs.org/)
   - **Version:** 18.19.0 LTS (or latest 18.x)
   - **Download:** Windows Installer (.msi)

2. Run the installer:
   - Accept license agreement
   - Choose installation path (default: `C:\Program Files\nodejs`)
   - Check "Add to PATH" (important!)
   - Check "Automatically install necessary tools"
   - Complete installation

3. Verify installation in PowerShell:
   ```powershell
   node --version    # Should show v18.x.x
   npm --version     # Should show 9.x.x or higher
   ```

### Step 2: Install Git

1. Download Git from [git-scm.com](https://git-scm.com/)
   - **Version:** Latest (2.40+)
   - **Download:** Windows 64-bit installer

2. Run the installer:
   - Accept license
   - Choose installation path
   - Select "Use Git from the command line and also from 3rd-party software"
   - Choose "Checkout Windows-style, commit Unix-style line endings"
   - Complete installation

3. Verify installation:
   ```powershell
   git --version     # Should show git version 2.x.x
   ```

4. Configure Git (first time only):
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Step 3: Clone Repository

1. Create a development folder:
   ```powershell
   mkdir C:\dev
   cd C:\dev
   ```

2. Clone the admin frontend repository:
   ```powershell
   git clone https://github.com/brookgit/bswadminfront.git
   cd bswadminfront
   ```

3. Verify you're on main branch:
   ```powershell
   git branch          # Should show * main
   git log --oneline  # Show recent commits
   ```

### Step 4: Install Dependencies

1. Install npm packages:
   ```powershell
   npm install
   # This creates node_modules/ folder (~500MB)
   # Takes 2-5 minutes depending on internet speed
   ```

2. Verify installation:
   ```powershell
   npm list react      # Should show react version
   npm list vite       # Should show vite version
   ```

### Step 5: Configure Environment

1. Create `.env.local` file in project root:
   ```powershell
   # In bswadminfront folder
   New-Item -Name ".env.local" -ItemType File
   ```

2. Add environment variables (for local development):
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

### Step 6: Start Development Server

1. Start the dev server:
   ```powershell
   npm run dev
   ```

2. Expected output:
   ```
   VITE v4.x.x  build 0.00s

   ➜  Local:   http://localhost:5173/
   ➜  press h to show help
   ```

3. Open browser and navigate to: `http://localhost:5173`

4. You should see the admin dashboard login page

### Troubleshooting Local Setup

**Port 5173 Already in Use:**
```powershell
# Find process using port
netstat -ano | findstr :5173

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5174
```

**npm Install Fails:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

**Node Version Mismatch:**
```powershell
# Check current version
node --version

# If wrong version, reinstall Node.js from nodejs.org
# Make sure to add to PATH during installation
```

**CORS Errors in Browser:**
- Ensure backend services are running on correct ports
- Check `.env.local` URLs match your backend setup
- Backend must be running for API calls to work

---

## Getting Started

### Prerequisites
- Node.js 18.x LTS (installed and verified)
- npm 9.x or higher (comes with Node.js)
- Git (installed and configured)
- GitHub access to repository
- Backend services running locally (optional for UI-only work)

### Quick Start

```powershell
# Clone the repository
git clone https://github.com/brookgit/bswadminfront.git
cd bswadminfront

# Install dependencies
npm install

# Create .env.local with backend URLs
# (See Step 5 above for environment variables)

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

## Local Development & Running

### Development Server

The development server runs with hot module replacement (HMR) - changes auto-reload in browser without restarting.

```powershell
npm run dev
```

**What happens:**
- Vite starts on `http://localhost:5173`
- Browser auto-opens (or manually navigate)
- Edit any file and see changes instantly
- Console shows build errors in real-time

**Expected behavior:**
- Fast startup (< 5 seconds)
- Instant file changes (< 1 second)
- No manual refresh needed
- TypeScript errors shown in browser

**Stop development server:**
```powershell
# Press Ctrl+C in terminal
```

### Production Build

Build optimized production version locally:

```powershell
npm run build
```

**What happens:**
- Vite bundles and minifies code
- Creates `dist/` folder (~2-3MB)
- Optimizes images and assets
- Takes 30-60 seconds

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   ├── index-def456.css
│   └── ...
└── ...
```

### Preview Production Build

Test production build locally:

```powershell
npm run preview
```

**What happens:**
- Serves production build from `dist/`
- Runs on `http://localhost:4173`
- Shows actual performance
- No hot reload (like production)

**Use cases:**
- Test before deployment
- Check performance
- Verify build output
- Test with production environment variables

### Local Backend Integration

To test with local backend services:

1. **Start backend services** (in separate terminal):
   ```powershell
   cd apps/backend
   docker-compose up -d
   # Wait for services to start (2-3 minutes)
   ```

2. **Verify backend is running:**
   ```powershell
   # Check if services are accessible
   curl http://localhost:1201/health
   curl http://localhost:1202/health
   curl http://localhost:1205/health
   ```

3. **Update `.env.local`** to point to local backend:
   ```env
   VITE_API_URL=http://localhost:1201
   VITE_ACCOUNT_SERVICE=http://localhost:1201
   VITE_CANDIDATE_SERVICE=http://localhost:1202
   VITE_PARTY_SERVICE=http://localhost:1205
   VITE_JOB_SERVICE=http://localhost:1250
   ```

4. **Start admin dashboard:**
   ```powershell
   npm run dev
   ```

5. **Login with test account:**
   - Email: admin@example.com
   - Password: (check backend setup docs)

### Performance Expectations

**Development Mode:**
- Initial load: 3-5 seconds
- File change reload: < 1 second
- Memory usage: 200-400MB
- CPU: Low (idle most of time)

**Production Build:**
- Build time: 30-60 seconds
- Bundle size: 2-3MB (gzipped: 600-800KB)
- Load time: < 2 seconds
- Memory usage: 50-100MB

**Typical Development Session:**
```
Start dev server:     5 seconds
First page load:      3 seconds
Edit component:       < 1 second reload
Edit style:           < 1 second reload
Edit API call:        < 1 second reload
```

### Running Tests

If tests are configured:

```powershell
npm run test          # Run tests once
npm run test:watch   # Watch mode (re-run on changes)
npm run test:coverage # Generate coverage report
```

---

## Deployment & Production

### Local Production Testing

Before pushing to GitHub, test production build:

```powershell
# Build production version
npm run build

# Preview production build
npm run preview

# Open http://localhost:4173 in browser
# Test all features
```

### GitHub Deployment

Push to GitHub to trigger automatic deployment:

```powershell
# Make changes
git add .
git commit -m "feat: add new feature"

# Push to main branch
git push origin main
```

**Automatic deployment process:**
1. GitHub Actions workflow triggers
2. Builds Docker image
3. Transfers to jumphost (197.156.110.145)
4. Deploys container
5. Reloads NGINX
6. Available at https://admin.besewonline.com

**Check deployment status:**
- Go to GitHub repository
- Click "Actions" tab
- View workflow run status
- Check logs if deployment fails

### Production Environment

**Production URL:** https://admin.besewonline.com

**Production Environment Variables:**
```env
VITE_API_URL=https://account.besewonline.com
VITE_ACCOUNT_SERVICE=https://account.besewonline.com
VITE_CANDIDATE_SERVICE=https://candidate.besewonline.com
VITE_PARTY_SERVICE=https://party.besewonline.com
VITE_JOB_SERVICE=https://job.besewonline.com
VITE_NOTIFICATION_SERVICE=https://notification.besewonline.com
VITE_COMMISSION_SERVICE=https://commission.besewonline.com
VITE_PSYCHOMETRIC_SERVICE=https://psychometric.besewonline.com
VITE_SEARCH_SERVICE=https://search.besewonline.com
VITE_REFERENCE_SERVICE=https://reference.besewonline.com
VITE_CAREER_INTELLIGENCE_SERVICE=https://career-intelligence.besewonline.com
```

**Production Deployment Details:**
- Container: besew-admin-dashboard
- Port: 3000 (internal) → 80 (NGINX)
- Network: backend_besew-network
- SSL: Let's Encrypt wildcard certificate
- Domain: admin.besewonline.com

---

## Version Information

### Current Versions

```json
{
  "node": "18.x LTS",
  "npm": "9.x or higher",
  "react": "^18.x",
  "vite": "^4.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "redux-toolkit": "^1.x",
  "axios": "^1.x"
}
```

### Check Installed Versions

```powershell
# System versions
node --version
npm --version

# Project dependencies
npm list react
npm list vite
npm list typescript
npm list tailwindcss

# Full dependency tree
npm list
```

### Update Dependencies

```powershell
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install react@latest

# Update to major version
npm install react@18.2.0
```

---

## System Requirements Summary

### Minimum
- Windows 10 or 11
- 8GB RAM
- 5GB free disk space
- Node.js 18.x LTS
- npm 9.x+
- Git 2.40+

### Recommended
- Windows 11 Pro
- 16GB+ RAM
- SSD with 10GB+ free space
- Visual Studio Code
- Node.js 18.19.0 LTS
- npm 10.x+
- Git 2.45+

### Disk Space Usage

```
node_modules/        ~500MB
dist/ (build)        ~2-3MB
.git/                ~50MB
Total project        ~600MB
```

---

## Development Workflow

### Daily Development

```powershell
# 1. Start development server
npm run dev

# 2. Make changes to files
# (Auto-reload in browser)

# 3. Check for errors
npm run type-check
npm run lint

# 4. Format code
npm run format

# 5. Commit changes
git add .
git commit -m "feat: add feature"

# 6. Push to GitHub
git push origin feature-branch

# 7. Create Pull Request on GitHub
```

### Before Pushing

```powershell
# 1. Run type check
npm run type-check

# 2. Run linter
npm run lint

# 3. Format code
npm run format

# 4. Build production version
npm run build

# 5. Preview production build
npm run preview

# 6. Test in browser
# (Verify all features work)

# 7. Commit and push
git add .
git commit -m "feat: add feature"
git push origin main
```

---

## Deployment Expectations

### Local Development
- **Startup time:** 5 seconds
- **Page load:** 3-5 seconds
- **File change reload:** < 1 second
- **Memory:** 200-400MB
- **CPU:** Low (idle)

### Production Build
- **Build time:** 30-60 seconds
- **Bundle size:** 2-3MB (gzipped: 600-800KB)
- **Page load:** < 2 seconds
- **Memory:** 50-100MB
- **CPU:** Low (idle)

### Deployment to Production
- **Trigger:** Push to main branch
- **Build time:** 2-3 minutes
- **Deploy time:** 1-2 minutes
- **Total time:** 3-5 minutes
- **Downtime:** < 30 seconds
- **Rollback:** Automatic (previous image)

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
