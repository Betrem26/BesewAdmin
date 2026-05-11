import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../store/store';
import { setToken } from '../store/features/userSlice';

export const API_ENDPOINTS = {
  account: import.meta.env.VITE_ACCOUNT_SERVICE || 'https://stage-account.besewonline.com',
  job: import.meta.env.VITE_JOB_SERVICE || 'https://job.besewonline.com',
  psychometric: import.meta.env.VITE_PSYCHOMETRIC_SERVICE || 'https://psychometric.besewonline.com',
  candidate: import.meta.env.VITE_CANDIDATE_SERVICE || 'https://candidate.besewonline.com',
  party: import.meta.env.VITE_PARTY_SERVICE || 'https://party.besewonline.com',
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
      const token = state.user.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
