// Core API service with axios and JWT token management
import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../store/store';
import { setToken } from '../store/features/userSlice';

// API Base URLs
export const API_ENDPOINTS = {
  account: 'https://account.besewonline.com',
  job: 'https://job.besewonline.com',
  psychometric: 'https://psychometric.besewonline.com',
  candidate: 'https://candidate.besewonline.com',
  party: 'https://party.besewonline.com',
  commission: 'https://commission.besewonline.com',
  employee: 'https://employee.besewonline.com',
  notification: 'https://notify.besewonline.com',
};

// Create API client with interceptors
const createApiClient = (baseURL: string): AxiosInstance => {
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
      const token = state.user.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors and token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const state = store.getState();
          const refreshToken = state.user.refreshToken || localStorage.getItem('refreshToken');

          if (refreshToken) {
            const response = await axios.post(
              `${API_ENDPOINTS.account}/auth/refresh-token`,
              { refresh_token: refreshToken }
            );

            const newToken = response.data.access_token;
            store.dispatch(setToken(newToken));

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - logout user
          console.error('Token refresh failed:', refreshError);
          store.dispatch({ type: 'user/logout' });
          localStorage.removeItem('refreshToken');
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('Forbidden: Insufficient permissions');
      }

      // Handle account status errors (pending_otp, etc.)
      const errorData = error.response?.data as any;
      if (errorData?.message?.includes('pending_otp')) {
        console.warn('Account requires OTP verification');
        // Redirect to OTP verification
        window.location.href = '/verify-otp';
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Export API clients for each service
export const accountApi = createApiClient(API_ENDPOINTS.account);
export const jobApi = createApiClient(API_ENDPOINTS.job);
export const psychometricApi = createApiClient(API_ENDPOINTS.psychometric);
export const candidateApi = createApiClient(API_ENDPOINTS.candidate);
export const partyApi = createApiClient(API_ENDPOINTS.party);
export const commissionApi = createApiClient(API_ENDPOINTS.commission);
export const employeeApi = createApiClient(API_ENDPOINTS.employee);
export const notificationApi = createApiClient(API_ENDPOINTS.notification);

// Generic API error handler
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error;
    return message || `Error: ${error.response.status} ${error.response.statusText}`;
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred';
  }
};
