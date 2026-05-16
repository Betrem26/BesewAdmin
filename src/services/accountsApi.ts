import { accountApi } from './api';

// Types matching the real API response from Swagger
export interface PartyType {
  id: number;
  name: string;
}

export interface Subscription {
  type: string;
  period: string;
  status: string;
  expires_at: string;
}

export interface Account {
  account_id: string;
  party_type: PartyType;
  party_id: string;
  profile_name: string;
  name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  phonenumber?: string;
  avatar?: string;
  role: string;
  date: string;
  status: string;
  is_verified?: boolean;
  verified?: boolean;
  country?: string;
  agency_party_id?: string;
  subscription?: Subscription;
}

export interface SecureAdminUpdateDto {
  target_party_id: string;
  new_role?: string;
  new_status?: string;
  mfa_challenge_id: string;
  reason?: string;
}

export interface AdminRoleChangeDto {
  target_party_id: string;
  new_role: string;
  reason?: string;
  mfa_challenge_id: string;
}

export interface PhoneUpdateDto {
  new_phonenumber: string;
  current_password: string;
  otp_code: string;
}

export interface PasswordUpdateDto {
  new_password: string;
  current_password: string;
}

export interface NationalIdValidationDto {
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const accountsApi = {
  // GET /accounts - Get all accounts (Admin Only)
  getAllAccounts: async (): Promise<Account[]> => {
    const response = await accountApi.get('/accounts');
    return response.data;
  },

  // GET /accounts/{partyId} - Get account by party ID
  getAccountByPartyId: async (partyId: string): Promise<Account> => {
    const response = await accountApi.get(`/accounts/${partyId}`);
    return response.data;
  },

  // DELETE /accounts/{partyId} - Delete any account (admin)
  deleteAccount: async (partyId: string): Promise<void> => {
    await accountApi.delete(`/accounts/${partyId}`);
  },

  // GET /accounts/by-phonenumber/{phonenumber} - Get account by phone number (Admin Only)
  getAccountByPhoneNumber: async (phoneNumber: string): Promise<Account> => {
    const response = await accountApi.get(`/accounts/by-phonenumber/${encodeURIComponent(phoneNumber)}`);
    return response.data;
  },

  // PUT /accounts/{id} - Update account
  updateAccount: async (id: string, accountData: Partial<Account>): Promise<Account> => {
    const response = await accountApi.put(`/accounts/${id}`, accountData);
    return response.data;
  },

  // DELETE /accounts/me - Delete my account
  deleteMyAccount: async (): Promise<void> => {
    await accountApi.delete('/accounts/me');
  },

  // PUT /accounts/admin/promote/{partyId} - MFA Required
  promoteToAdmin: async (partyId: string, reason: string, mfa_challenge_id: string): Promise<any> => {
    const response = await accountApi.put(`/accounts/admin/promote/${partyId}`, { reason, mfa_challenge_id });
    return response.data;
  },

  // PUT /accounts/admin/demote/{partyId} - MFA Required
  demoteToUser: async (partyId: string, reason: string, mfa_challenge_id: string): Promise<any> => {
    const response = await accountApi.put(`/accounts/admin/demote/${partyId}`, { reason, mfa_challenge_id });
    return response.data;
  },

  // PUT /accounts/admin/secure-update - Secure admin account update (MFA Required)
  secureAdminUpdate: async (updateData: SecureAdminUpdateDto): Promise<any> => {
    const response = await accountApi.put('/accounts/admin/secure-update', updateData);
    return response.data;
  },

  // PUT /accounts/secure/phone-update - Secure phone number update (OTP Required)
  securePhoneUpdate: async (phoneData: PhoneUpdateDto): Promise<any> => {
    const response = await accountApi.put('/accounts/secure/phone-update', phoneData);
    return response.data;
  },

  // PUT /accounts/secure/password-update - Secure password update
  securePasswordUpdate: async (passwordData: PasswordUpdateDto): Promise<any> => {
    const response = await accountApi.put('/accounts/secure/password-update', passwordData);
    return response.data;
  },

  // PUT /accounts/admin/role-change - Admin role change (MFA Required)
  adminRoleChange: async (data: AdminRoleChangeDto): Promise<any> => {
    const response = await accountApi.put('/accounts/admin/role-change', data);
    return response.data;
  },

  // GET /accounts/employee/{phonenumber} - Get employee accounts by phone
  getEmployeeAccountsByPhone: async (phoneNumber: string): Promise<Account[]> => {
    const response = await accountApi.get(`/accounts/employee/${encodeURIComponent(phoneNumber)}`);
    return response.data;
  },

  // GET /accounts/agency/{agencyPartyId} - Get all employee accounts for an agency
  getEmployeeAccountsByAgency: async (agencyPartyId: string): Promise<Account[]> => {
    const response = await accountApi.get(`/accounts/agency/${agencyPartyId}`);
    return response.data;
  },

  // GET /accounts/stats - Admin only
  getStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: { user: number; agency: number; admin: number };
    byStatus: { active: number; pending_otp: number; inactive: number; suspended: number };
    growth: { today: number; thisWeek: number; thisMonth: number };
    lastUpdated: string;
  }> => {
    const response = await accountApi.get('/accounts/stats');
    return response.data;
  },

  // GET /accounts/recent?limit=N - Admin only
  getRecentAccounts: async (limit = 5): Promise<Array<{
    party_id: string;
    profile_name: string;
    role: string;
    status: string;
    date: string;
  }>> => {
    const response = await accountApi.get(`/accounts/recent?limit=${limit}`);
    return response.data;
  },

  // GET /accounts/activity-logs - Admin only
  getActivityLogs: async (page = 1, limit = 10): Promise<{
    data: Array<{ party_id: string; action: string; timestamp: string; ipAddress?: string; userAgent?: string }>;
    pagination: { page: number; limit: number; total: number; pages: number };
  }> => {
    const response = await accountApi.get(`/accounts/activity-logs?page=${page}&limit=${limit}`);
    return response.data;
  },

  // GET /accounts/{partyId}/roles
  getRoles: async (partyId: string): Promise<{ party_id: string; roles: string[] }> => {
    const response = await accountApi.get(`/accounts/${partyId}/roles`);
    return response.data;
  },

  // POST /accounts/validate-national-id
  validateNationalId: async (data: NationalIdValidationDto): Promise<any> => {
    const response = await accountApi.post('/accounts/validate-national-id', data);
    return response.data;
  },
};

export default accountsApi;
