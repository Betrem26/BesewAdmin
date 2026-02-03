// Account Reports API Service
import { accountApi, handleApiError } from './api';

export interface AccountReport {
  _id: string;
  reporterPartyId: string;
  reportedPartyId: string;
  type: 'fraud' | 'abuse' | 'spam' | 'inappropriate' | 'other';
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface UpdateReportStatusDto {
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  adminNotes?: string;
}

export interface AccountRating {
  accountId: string;
  rating: number;
  explanation: string;
  totalReports: number;
  unresolvedReports: number;
}

export const accountReportsApi = {
  /**
   * Get all account reports (Admin only)
   */
  getAllReports: async (): Promise<AccountReport[]> => {
    try {
      const response = await accountApi.get<AccountReport[]>('/account-report/admin');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get specific account report by ID (Admin only)
   */
  getReport: async (id: string): Promise<AccountReport> => {
    try {
      const response = await accountApi.get<AccountReport>(`/account-report/admin/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update account report status (Admin only)
   */
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

  /**
   * Delete account report (Admin only)
   */
  deleteReport: async (id: string): Promise<void> => {
    try {
      await accountApi.delete(`/account-report/admin/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get account trust rating
   */
  getAccountRating: async (accountId: string): Promise<AccountRating> => {
    try {
      const response = await accountApi.get<AccountRating>(`/account-report/rating/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get report statistics
   */
  getReportStats: async (): Promise<{
    total: number;
    pending: number;
    under_review: number;
    resolved: number;
    dismissed: number;
  }> => {
    try {
      const reports = await accountReportsApi.getAllReports();
      return {
        total: reports.length,
        pending: reports.filter(r => r.status === 'pending').length,
        under_review: reports.filter(r => r.status === 'under_review').length,
        resolved: reports.filter(r => r.status === 'resolved').length,
        dismissed: reports.filter(r => r.status === 'dismissed').length,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
