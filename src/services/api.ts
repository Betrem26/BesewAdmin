import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../store/store';
import { setToken } from '../store/features/userSlice';

export const API_ENDPOINTS = {
  account: import.meta.env.VITE_ACCOUNT_SERVICE
    || (import.meta.env.DEV ? '/api/account' : 'https://stage-account.besewonline.com'),
  job: import.meta.env.VITE_JOB_SERVICE || 'https://stage-jobs.besewonline.com',
  psychometric: import.meta.env.VITE_PSYCHOMETRIC_SERVICE || 'https://psychometric.besewonline.com',
  candidate: import.meta.env.VITE_CANDIDATE_SERVICE || 'https://candidate.besewonline.com',
  party: import.meta.env.VITE_PARTY_SERVICE || 'https://stage-party.besewonline.com',
  commission: import.meta.env.VITE_COMMISSION_SERVICE || 'https://commission.besewonline.com',
  employee: import.meta.env.VITE_EMPLOYEE_SERVICE || 'https://employee.besewonline.com',
  notification: import.meta.env.VITE_NOTIFICATION_SERVICE || 'https://notify.besewonline.com',
};

const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use(
    (config) => {
      const state = store.getState();
      let token = state.user.accessToken;
      
      if (token) {
        // ── ADMIN ROLE OVERRIDE ──────────────────────────────────────────
        // If the user is an admin, we need to modify the token to include
        // a 'user' or 'agency' role for the job service to accept it.
        // This is a temporary workaround until the job service recognizes admin role.
        const isJobService = config.baseURL?.includes('stage-jobs') || config.baseURL?.includes('job');
        if (isJobService) {
          try {
            // Decode the JWT to check the role
            const parts = token.split('.');
            if (parts.length === 3) {
              const decoded = JSON.parse(atob(parts[1]));
              if (decoded.role === 'admin') {
                // For admin users accessing job service, we'll add a custom header
                // to signal that this is an admin with elevated permissions
                // COMMENTED OUT: These custom headers cause CORS preflight issues
                // config.headers['X-Admin-Override'] = 'true';
                // config.headers['X-User-Role'] = 'admin';
              }
            }
          } catch (e) {
            // If JWT parsing fails, just continue with the original token
          }
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      }

      // ── DEV: log every outgoing request so we can verify headers ──────────
      if (import.meta.env.DEV) {
        const isJobService = config.baseURL?.includes('stage-jobs') || config.baseURL?.includes('job');
        if (isJobService) {
          console.group(`[JobAPI] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
          console.log('Authorization:', config.headers.Authorization
            ? `Bearer ${String(config.headers.Authorization).slice(7, 30)}…`
            : '⚠ MISSING');
          console.log('Token in Redux:', token ? `${token.slice(0, 30)}…` : '⚠ NULL');
          console.log('Admin Override:', config.headers['X-Admin-Override'] || 'none');
          console.log('Full headers:', { ...config.headers });
          console.groupEnd();
        }
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const state = store.getState();
        const refreshToken = state.user.refreshToken || localStorage.getItem('refreshToken');

        // Only attempt refresh if we actually have a refresh token
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${API_ENDPOINTS.account}/auth/refresh-token`,
              { refresh_token: refreshToken }
            );
            const newToken = response.data.access_token;
            store.dispatch(setToken(newToken));
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest);
          } catch {
            // Refresh token itself is invalid — now it's safe to logout
            store.dispatch({ type: 'user/logout' });
            localStorage.removeItem('refreshToken');
            window.location.href = '/';
          }
        }
        // No refresh token available — just reject, don't logout
      }

      // For 403 and all other errors — just reject, let the caller handle it
      if (import.meta.env.DEV && error.response?.status === 403) {
        const cfg = error.config as any;
        const isJobService = cfg?.baseURL?.includes('stage-jobs') || cfg?.baseURL?.includes('job');
        const isPlatformAdmin = cfg?.baseURL?.includes('stage-party') && cfg?.url?.includes('platform-admin');
        
        if (isJobService) {
          console.group(`[JobAPI] 403 Forbidden — ${cfg?.url}`);
          console.log('Request URL:', `${cfg?.baseURL}${cfg?.url}`);
          console.log('Authorization sent:', cfg?.headers?.Authorization
            ? `Bearer ${String(cfg.headers.Authorization).slice(7, 30)}…`
            : '⚠ MISSING — token was not attached!');
          console.log('Response body:', error.response?.data);
          console.log('');
          console.log('DIAGNOSIS: Token has role:"admin" but job service rejects it.');
          console.log('Likely cause: email is null in JWT or party_id not in job-service DB.');
          console.log('This is a backend configuration issue, not a frontend bug.');
          console.groupEnd();
        }
        
        if (isPlatformAdmin) {
          const token = store.getState().user.accessToken;
          let tokenRole = 'unknown';
          try {
            if (token) {
              const parts = token.split('.');
              if (parts.length === 3) {
                const decoded = JSON.parse(atob(parts[1]));
                tokenRole = decoded.role || 'no-role';
              }
            }
          } catch (e) {
            tokenRole = 'parse-error';
          }
          
          console.group(`[PlatformAdmin] 403 Forbidden — ${cfg?.url}`);
          console.log('Request URL:', `${cfg?.baseURL}${cfg?.url}`);
          console.log('Authorization sent:', cfg?.headers?.Authorization
            ? `Bearer ${String(cfg.headers.Authorization).slice(7, 30)}…`
            : '⚠ MISSING — token was not attached!');
          console.log('Token role:', tokenRole);
          console.log('Response body:', error.response?.data);
          console.log('');
          console.log('DIAGNOSIS: Platform Admin endpoint requires admin role.');
          console.log('Your token role is:', tokenRole);
          console.log('Backend is rejecting access - check if:');
          console.log('  1. Your account has admin role assigned');
          console.log('  2. Backend Platform Admin Guard is properly configured');
          console.log('  3. Account Service is accessible to Party Service');
          console.groupEnd();
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const accountApi = createApiClient(API_ENDPOINTS.account);
export const jobApi = createApiClient(API_ENDPOINTS.job);
export const psychometricApi = createApiClient(API_ENDPOINTS.psychometric);
export const candidateApi = createApiClient(API_ENDPOINTS.candidate);
export const partyApi = createApiClient(API_ENDPOINTS.party);
export const commissionApi = createApiClient(API_ENDPOINTS.commission);
export const employeeApi = createApiClient(API_ENDPOINTS.employee);
export const notificationApi = createApiClient(API_ENDPOINTS.notification);

export const handleApiError = (error: any): string => {
  if (error.response) {
    const message = error.response.data?.message || error.response.data?.error;
    return message || `Error: ${error.response.status} ${error.response.statusText}`;
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * DEV ONLY — runs a raw fetch() to stage-jobs bypassing Axios entirely.
 * Call this from the browser console: window.__debugJobAuth()
 * This proves whether the 403 is an Axios/header issue or a pure backend issue.
 */
if (import.meta.env.DEV) {
  (window as any).__debugJobAuth = async () => {
    const token = store.getState().user.accessToken;
    if (!token) { console.error('[debugJobAuth] No token in Redux store'); return; }

    const endpoints = [
      '/posts/stats',
      '/posts/agency/stats',
      '/applications/stats',
      '/posts?page=1&limit=5',
    ];

    const base = import.meta.env.VITE_JOB_SERVICE || 'https://stage-jobs.besewonline.com';

    console.group('[debugJobAuth] Raw fetch() to job service — bypassing Axios');
    console.log('Base URL:', base);
    console.log('Token (first 60 chars):', token.slice(0, 60) + '…');
    console.log('');

    for (const ep of endpoints) {
      try {
        const res = await fetch(`${base}${ep}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const body = await res.json().catch(() => ({}));
        const icon = res.ok ? '✅' : res.status === 403 ? '🔒' : '❌';
        console.log(`${icon} ${res.status} ${ep}`, body);
      } catch (e) {
        console.log(`💥 NETWORK ERROR ${ep}`, e);
      }
    }

    console.log('');
    console.log('If all show 403: the backend is rejecting this token regardless of how it is sent.');
    console.log('If any show 200: there was an Axios header issue (now fixed).');
    console.groupEnd();
  };

  (window as any).__debugPlatformAdmin = async () => {
    const token = store.getState().user.accessToken;
    if (!token) { console.error('[debugPlatformAdmin] No token in Redux store'); return; }

    const endpoints = [
      '/platform-admin/companies?limit=10',
      '/platform-admin/companies/stats',
    ];

    const base = import.meta.env.VITE_PARTY_SERVICE || 'https://stage-party.besewonline.com';

    console.group('[debugPlatformAdmin] Raw fetch() to party service — bypassing Axios');
    console.log('Base URL:', base);
    console.log('Token (first 60 chars):', token.slice(0, 60) + '…');
    
    // Decode token to show full payload
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const decoded = JSON.parse(atob(parts[1]));
        console.log('Full token payload:', decoded);
        console.log('Token role:', decoded.role || 'no-role');
        console.log('Token email:', decoded.email || 'no-email ⚠️ MISSING!');
        console.log('Token sub:', decoded.sub || 'no-sub');
        console.log('Token party_id:', decoded.party_id || 'no-party_id');
      }
    } catch (e) {
      console.log('Could not decode token');
    }
    console.log('');

    for (const ep of endpoints) {
      try {
        const res = await fetch(`${base}${ep}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const body = await res.json().catch(() => ({}));
        const icon = res.ok ? '✅' : res.status === 403 ? '🔒' : '❌';
        console.log(`${icon} ${res.status} ${ep}`, body);
      } catch (e) {
        console.log(`💥 NETWORK ERROR ${ep}`, e);
      }
    }

    console.log('');
    console.log('DIAGNOSIS:');
    console.log('If email is "no-email": Backend cannot verify admin privileges without email in token.');
    console.log('Solution: Backend needs to include email claim in JWT token generation.');
    console.log('Workaround: Log out and log back in to get a fresh token.');
    console.groupEnd();
  };

  console.info('[JobAPI Debug] Run window.__debugJobAuth() in the console to test job service auth directly.');
  console.info('[PlatformAdmin Debug] Run window.__debugPlatformAdmin() in the console to test platform admin auth directly.');
}
