import { accountApi } from '../services/api';

export interface Account {
  _id: string;
  act_id?: string;
  party_id?: string;
  uname: string;
  email: string;
  phonenumber?: string;
  phone?: string;
  role: string;
  agency?: string;
  company?: string;
  location?: string;
  status: string;
  isOtpVerified?: boolean;
  verified?: boolean;
  createdAt?: string;
  created_at?: string;
  lastLoginAt?: string;
  last_login?: string;
}

export interface AccountsResponse {
  success: boolean;
  data: Account[];
  message?: string;
}

export const accountService = {
  getAccounts: async (params?: any) => {
    try {
      const response = await accountApi.get<AccountsResponse>('/api/accounts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  createAccount: async (accountData: Partial<Account>) => {
    try {
      const response = await accountApi.post<AccountsResponse>('/api/accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  updateAccount: async (id: string, accountData: Partial<Account>) => {
    try {
      const response = await accountApi.put<AccountsResponse>(`/accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  },

  deleteAccount: async (id: string) => {
    try {
      const response = await accountApi.delete<AccountsResponse>(`/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  // New endpoints from Swagger UI

  getAvailableSpecialOffers: async () => {
    try {
      const response = await accountApi.get<any>('/api/accounts/special-offers/available');
      return response.data;
    } catch (error) {
      console.error('Error getting special offers:', error);
      throw error;
    }
  },

  checkPasswordStrength: async (data: { password: string }) => {
    try {
      const response = await accountApi.post<any>('/api/accounts/password-strength', data);
      return response.data;
    } catch (error) {
      console.error('Error checking password strength:', error);
      throw error;
    }
  },

  getAccountByPartyId: async (partyId: string) => {
    try {
      const response = await accountApi.get<AccountsResponse>(`/accounts/${partyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching account by party ID:', error);
      throw error;
    }
  },

  getAccountByPhoneNumber: async (phoneNumber: string) => {
    try {
      const response = await accountApi.get<AccountsResponse>(`/accounts/by-phonenumber/${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching account by phone number:', error);
      throw error;
    }
  },

  deleteMyAccount: async () => {
    try {
      const response = await accountApi.delete<AccountsResponse>('/api/accounts/me');
      return response.data;
    } catch (error) {
      console.error('Error deleting my account:', error);
      throw error;
    }
  },

  promoteToAdmin: async (partyId: string) => {
    try {
      const response = await accountApi.put<AccountsResponse>(`/accounts/admin/promote/${partyId}`);
      return response.data;
    } catch (error) {
      console.error('Error promoting to admin:', error);
      throw error;
    }
  },

  demoteToUser: async (partyId: string) => {
    try {
      const response = await accountApi.put<AccountsResponse>(`/accounts/admin/demote/${partyId}`);
      return response.data;
    } catch (error) {
      console.error('Error demoting to user:', error);
      throw error;
    }
  },

  secureAdminUpdate: async (data: any) => {
    try {
      const response = await accountApi.put<AccountsResponse>('/api/accounts/admin/secure-update', data);
      return response.data;
    } catch (error) {
      console.error('Error securing admin update:', error);
      throw error;
    }
  },

  securePhoneUpdate: async (data: any) => {
    try {
      const response = await accountApi.put<AccountsResponse>('/api/accounts/secure/phone-update', data);
      return response.data;
    } catch (error) {
      console.error('Error securing phone update:', error);
      throw error;
    }
  },

  securePasswordUpdate: async (data: any) => {
    try {
      const response = await accountApi.put<AccountsResponse>('/api/accounts/secure/password-update', data);
      return response.data;
    } catch (error) {
      console.error('Error securing password update:', error);
      throw error;
    }
  },

  adminRoleChange: async (data: any) => {
    try {
      const response = await accountApi.put<AccountsResponse>('/api/accounts/admin/role-change', data);
      return response.data;
    } catch (error) {
      console.error('Error changing admin role:', error);
      throw error;
    }
  },

  getEmployeeAccountsByPhone: async (phoneNumber: string) => {
    try {
      const response = await accountApi.get<AccountsResponse>(`/accounts/employee/${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee accounts by phone:', error);
      throw error;
    }
  },

  getEmployeeAccountsByAgency: async (agencyPartyId: string) => {
    try {
      const response = await accountApi.get<AccountsResponse>(`/accounts/agency/${agencyPartyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee accounts by agency:', error);
      throw error;
    }
  }
};