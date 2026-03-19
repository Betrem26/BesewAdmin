// Change from:
// import api from './api';

// To (use the accountApi named export):
import { accountApi } from './api';
import { AxiosResponse } from 'axios';

// Types
export interface Account {
  id: string;
  partyId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profilePicture?: string;
  mfaEnabled?: boolean;
}

export interface CreateAccountDto {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

export interface UpdateAccountDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
}

export interface PhoneUpdateDto {
  newPhoneNumber: string;
  otp: string;
}

export interface PasswordUpdateDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecureAdminUpdateDto {
  userId: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  mfaToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// Accounts API service - using accountApi from your api.ts
const accountsApi = {
  // POST /accounts - Create a new account
  createAccount: async (accountData: CreateAccountDto): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.post('/api/accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Create account error:', error);
      throw error;
    }
  },

  // GET /accounts - Get all accounts (Admin Only)
  getAllAccounts: async (): Promise<ApiResponse<Account[]>> => {
    try {
      const response: AxiosResponse = await accountApi.get('/api/accounts');
      return response.data;
    } catch (error) {
      console.error('Get all accounts error:', error);
      throw error;
    }
  },

  // GET /accounts/{partyId} - Get account by party ID
  getAccountByPartyId: async (partyId: string): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.get(`/accounts/${partyId}`);
      return response.data;
    } catch (error) {
      console.error('Get account by party ID error:', error);
      throw error;
    }
  },

  // DELETE /accounts/{partyId} - Delete any account (admin)
  deleteAccount: async (partyId: string): Promise<ApiResponse<null>> => {
    try {
      const response: AxiosResponse = await accountApi.delete(`/accounts/${partyId}`);
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  // GET /accounts/by-phonenumber/{phonenumber} - Get account by phone number (Admin Only)
  getAccountByPhoneNumber: async (phoneNumber: string): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.get(`/accounts/by-phonenumber/${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Get account by phone number error:', error);
      throw error;
    }
  },

  // PUT /accounts/{id} - Update account with mass assignment protection
  updateAccount: async (id: string, accountData: UpdateAccountDto): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.put(`/accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      console.error('Update account error:', error);
      throw error;
    }
  },

  // DELETE /accounts/me - Delete my account
  deleteMyAccount: async (): Promise<ApiResponse<null>> => {
    try {
      const response: AxiosResponse = await accountApi.delete('/api/accounts/me');
      return response.data;
    } catch (error) {
      console.error('Delete my account error:', error);
      throw error;
    }
  },

  // PUT /accounts/admin/promote/{partyId} - Promote user to admin (Super Admin Only)
  promoteToAdmin: async (partyId: string): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.put(`/accounts/admin/promote/${partyId}`);
      return response.data;
    } catch (error) {
      console.error('Promote to admin error:', error);
      throw error;
    }
  },

  // PUT /accounts/admin/demote/{partyId} - Demote admin to user (Super Admin Only)
  demoteToUser: async (partyId: string): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.put(`/accounts/admin/demote/${partyId}`);
      return response.data;
    } catch (error) {
      console.error('Demote to user error:', error);
      throw error;
    }
  },

  // PUT /accounts/admin/secure-update - Secure admin account update (MFA Required)
  secureAdminUpdate: async (updateData: SecureAdminUpdateDto): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.put('/api/accounts/admin/secure-update', updateData);
      return response.data;
    } catch (error) {
      console.error('Secure admin update error:', error);
      throw error;
    }
  },

  // PUT /accounts/secure/phone-update - Secure phone number update (OTP Required)
  securePhoneUpdate: async (phoneData: PhoneUpdateDto): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.put('/api/accounts/secure/phone-update', phoneData);
      return response.data;
    } catch (error) {
      console.error('Secure phone update error:', error);
      throw error;
    }
  },

  // PUT /accounts/secure/password-update - Secure password update (Current Password Required)
  securePasswordUpdate: async (passwordData: PasswordUpdateDto): Promise<ApiResponse<null>> => {
    try {
      const response: AxiosResponse = await accountApi.put('/api/accounts/secure/password-update', passwordData);
      return response.data;
    } catch (error) {
      console.error('Secure password update error:', error);
      throw error;
    }
  },

  // PUT /accounts/admin/role-change - Admin role change (MFA Required)
  adminRoleChange: async (partyId: string, newRole: 'user' | 'admin', mfaToken: string): Promise<ApiResponse<Account>> => {
    try {
      const response: AxiosResponse = await accountApi.put('/api/accounts/admin/role-change', {
        partyId,
        newRole,
        mfaToken
      });
      return response.data;
    } catch (error) {
      console.error('Admin role change error:', error);
      throw error;
    }
  },
};

export default accountsApi;