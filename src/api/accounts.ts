import axios from 'axios';

const API_URL = 'https://account.besewonline.com/api';

export interface Account {
  _id: string;
  act_id: string;
  uname: string;
  email: string;
  role: string;
  agency: string;
  company: string;
  location: string;
  status: string;
}

export interface AccountsResponse {
  success: boolean;
  data: Account[];
  message?: string;
}

const accountsApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
accountsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const accountService = {
  getAccounts: async () => {
    try {
      const response = await accountsApi.get<AccountsResponse>('/accounts');
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  createAccount: async (accountData: Partial<Account>) => {
    try {
      const response = await accountsApi.post<AccountsResponse>('/accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  updateAccount: async (id: string, accountData: Partial<Account>) => {
    try {
      const response = await accountsApi.put<AccountsResponse>(`/accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  },

  deleteAccount: async (id: string) => {
    try {
      const response = await accountsApi.delete<AccountsResponse>(`/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
};