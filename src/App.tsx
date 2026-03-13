import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import SignIn from './pages/auth/SignIn';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ExecutiveDashboard from './pages/dashboard/ExecutiveDashboard';
import SystemHealth from './pages/dashboard/SystemHealth';
import { Analytics } from './pages/dashboard/Analytics';
import CustomerSupport from './pages/dashboard/CustomerSupport';
import OTPManagement from './pages/dashboard/OTPManagement';
import AccountReports from './pages/dashboard/AccountReports';
import JobCategories from './pages/dashboard/JobCategories';
import Psychometric from './pages/dashboard/Psychometric';
import { PsychometricAnalytics } from './pages/dashboard/PsychometricAnalytics';
import UserManagement from './pages/dashboard/UserManagement';
import UserManagementEnhanced from './pages/dashboard/UserManagementEnhanced';
import JobMonitoring from './pages/dashboard/JobMonitoring';
import StartupManagement from './pages/dashboard/StartupManagement';
import CandidateManagement from './pages/dashboard/CandidateManagement';
import CommissionTracking from './pages/dashboard/CommissionTracking';
import NotificationCenter from './pages/dashboard/NotificationCenter';
import AuditLogs from './pages/dashboard/AuditLogs';
import RoleManagement from './pages/RoleManagement';
import Settings from './pages/settings/Settings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: RootState) => state.user.accessToken);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignIn />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="executive" element={<ExecutiveDashboard />} />
            <Route path="system-health" element={<SystemHealth />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="support" element={<CustomerSupport />} />
            <Route path="reports" element={<AccountReports />} />
            <Route path="otp" element={<OTPManagement />} />
            <Route path="job-categories" element={<JobCategories />} />
            <Route path="psychometric" element={<Psychometric />} />
            <Route path="psychometric-analytics" element={<PsychometricAnalytics />} />
            <Route path="users" element={<UserManagementEnhanced />} />
            <Route path="users/basic" element={<UserManagement />} />
            <Route path="jobs" element={<JobMonitoring />} />
            <Route path="startups" element={<StartupManagement />} />
            <Route path="candidates" element={<CandidateManagement />} />
            <Route path="commissions" element={<CommissionTracking />} />
            <Route path="notifications" element={<NotificationCenter />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
