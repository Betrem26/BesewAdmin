import { accountApi, handleApiError } from './api';

export interface AccountReport {
  id: string;
  reporterPartyId: string;
  reportedPartyId: string;
  type: string;
  description: string;
  status: 'pending' | 'in_mediation' | 'in_progress' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  vacancyId?: string;
  ethicalPremiumBadgeLevel?: string | null;
}

export interface CreateReportDto {
  reportedPartyId: string;
  type: string;
  description: string;
  vacancyId?: string;
}

export interface UpdateReportStatusDto {
  status: 'pending' | 'in_mediation' | 'in_progress' | 'resolved' | 'dismissed';
  adminNotes?: string;
}

export interface AccountRating {
  accountId: string;
  rating: number;
  explanation: string;
  ethicalPremiumBadgeLevel: 'GOLD' | 'SILVER' | 'BRONZE' | null;
}

export const accountReportsApi = {
  // POST /account-report
  createReport: async (data: CreateReportDto): Promise<AccountReport> => {
    try {
      const response = await accountApi.post<AccountReport>('/account-report', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /account-report/my
  getMyReports: async (): Promise<AccountReport[]> => {
    try {
      const response = await accountApi.get<AccountReport[]>('/account-report/my');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /account-report/admin (Admin only)
  getAllReports: async (): Promise<AccountReport[]> => {
    try {
      const response = await accountApi.get<AccountReport[]>('/account-report/admin');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /account-report/admin/{id} (Admin only)
  getReport: async (id: string): Promise<AccountReport> => {
    try {
      const response = await accountApi.get<AccountReport>(`/account-report/admin/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // DELETE /account-report/admin/{id} (Admin only)
  deleteReport: async (id: string): Promise<void> => {
    try {
      await accountApi.delete(`/account-report/admin/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // PUT /account-report/admin/{id}/status (Admin only)
  updateReportStatus: async (id: string, data: UpdateReportStatusDto): Promise<AccountReport> => {
    try {
      const response = await accountApi.put<AccountReport>(
        `/account-report/admin/${id}/status`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /account-report/rating/{accountId}
  getAccountRating: async (accountId: string): Promise<AccountRating> => {
    try {
      const response = await accountApi.get<AccountRating>(`/account-report/rating/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Computed stats from report list
  getReportStats: async (): Promise<{
    total: number; pending: number; in_mediation: number; resolved: number; dismissed: number;
  }> => {
    try {
      const reports = await accountReportsApi.getAllReports();
      return {
        total: reports.length,
        pending: reports.filter(r => r.status === 'pending').length,
        in_mediation: reports.filter(r => r.status === 'in_mediation').length,
        resolved: reports.filter(r => r.status === 'resolved').length,
        dismissed: reports.filter(r => r.status === 'dismissed').length,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
