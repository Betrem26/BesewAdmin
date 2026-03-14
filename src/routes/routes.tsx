import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import VacanciesDetail from "../pages/VacanciesDetail";
import Accounts from "../pages/accounts/Accounts";
import Vacancies from "../pages/Vacancies";
import Users from "../pages/Users";
import Reports from "../pages/Reports";
import ReportsDetail from "../pages/ReportsDetail";
import Payments from "../pages/Payments";
import Agencies from "../pages/Agencies";
import LoginCard from "../pages/auth/Login";
import { useSelector } from "react-redux";
import ForgotPassword from "../pages/auth/ForgotPassword";
import { RootState } from "../store/store";
import PartyDetail from "../pages/party/PartyDetail";
import CompanyDetail from "../pages/party/CompanyDetail";
import SignIn from "../pages/auth/SignIn";
import Settings from "../pages/auth/Settings";
import AccountPreferences from "../pages/auth/Account-Preference";
import SignInSecurity from "../pages/auth/SignInSecurity";
import TwoFactorSetup from "../pages/auth/TwoFactorSetup";
import Fraud from "../pages/fraud/Fraud";
import AdManagement from "../pages/ad-management/AdManagement";
import Visibility from "../pages/auth/Visibility";
import AdvertisingData from "../pages/auth/AdvertisingData";
import Notifications from "../pages/auth/Notifications";
import HelpCenter from "../pages/auth/HelpCenter";
import ResetPassword from "../pages/auth/ResetPassword";
import JobList from "../pages/job/JobList";
type RouteElement = React.ReactElement | null;
interface Route {
  path: string;
  element: RouteElement;
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useSelector((state: RootState) => state.user);
  const persistorState = useSelector((state: RootState) => (state as any)._persist);

  // Wait until redux-persist rehydrates
  if (!persistorState?.rehydrated) return <p>Loading...</p>;

  const isAuthenticated = !!accessToken;
  console.log("PrivateRoute:", { isAuthenticated, accessToken });

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};;

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  { path: "/login", element: <LoginCard /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/settings", element: <Settings /> },
  {
    path: "/account-preferences",
    element: (
      <PrivateRoute>
        <AccountPreferences />
      </PrivateRoute>
    ),
  },

 ,
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/fraud",
    element: (
      <PrivateRoute>
        <Fraud />
      </PrivateRoute>
    ),
  },
  {
    path: "/ad-management",
    element: (
      <PrivateRoute>
        <AdManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/signin-security",
    element: (
      <PrivateRoute>
        <SignInSecurity />
      </PrivateRoute>
    ),
  }, // ADD THIS LINE
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/two-factor-setup",
    element: (
      <PrivateRoute>
        <TwoFactorSetup />
      </PrivateRoute>
    ),
  },
  {
    path: "/jobs",
    element: (
      <PrivateRoute>
        <Jobs />
      </PrivateRoute>
    ),
  },
  {
    path: "/vacancies",
    element: (
      <PrivateRoute>
        <Vacancies />
      </PrivateRoute>
    ),
  },
  {
    path: "/help-center",
    element: (
      <PrivateRoute>
        <HelpCenter />
      </PrivateRoute>
    ),
  },
  {
    path: "/vacancies/*",
    element: (
      <PrivateRoute>
        <VacanciesDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "/accounts",
    element: (
      <PrivateRoute>
        <Accounts />
      </PrivateRoute>
    ),
  },
  {
    path: "/Users",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    path: "/visibility",
    element: (
      <PrivateRoute>
        <Visibility />
      </PrivateRoute>
    ),
  },
  {
    path: "/advertising-data",
    element: (
      <PrivateRoute>
        <AdvertisingData />
      </PrivateRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <PrivateRoute>
        <Reports />
      </PrivateRoute>
    ),
  },
  {
    path: "/payments",
    element: (
      <PrivateRoute>
        <Payments />
      </PrivateRoute>
    ),
  },
  {
    path: "/agencies",
    element: (
      <PrivateRoute>
        <Agencies />
      </PrivateRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
  {
    path: "/reports/*",
    element: (
      <PrivateRoute>
        <ReportsDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "/party-detail/:partyId",
    element: (
      <PrivateRoute>
        <PartyDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "/company-detail/:partyId",
    element: (
      <PrivateRoute>
        <CompanyDetail />
      </PrivateRoute>
    ),
  },
  { path: "/jobs-list", element: <JobList /> },
  { path: "*", element: <Navigate to="/" replace /> },
] as Route[]);
