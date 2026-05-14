import { partyApi } from './api';

/**
 * Platform Admin API Service
 * Handles all platform-wide admin operations for company management,
 * verification, feedback, and reporting
 * 
 * Backend Endpoints (Party Service):
 * - GET    /platform-admin/companies
 * - GET    /platform-admin/companies/stats
 * - GET    /platform-admin/companies/:id
 * - PUT    /platform-admin/companies/:id
 * - DELETE /platform-admin/companies/:id
 * - POST   /platform-admin/companies/:id/verify
 * - GET    /platform-admin/companies/:id/verification
 * - POST   /platform-admin/companies/:id/reverify
 * - GET    /platform-admin/companies/search/by-tin/:tinNumber
 * - GET    /platform-admin/companies/search/by-license/:licenseNumber
 * - GET    /platform-admin/feedback/companies/:id
 * - GET    /platform-admin/feedback/all
 * - GET    /platform-admin/feedback/stats
 * - GET    /platform-admin/feedback/reports/companies/:id
 * - GET    /platform-admin/feedback/reports/all
 * - PUT    /platform-admin/feedback/reports/:id/status
 * - GET    /platform-admin/feedback/health
 */

export const platformAdminApi = {
  /**
   * Get all companies with optional filters
   */
  getAllCompanies: async (filters?: {
    verification_status?: 'pending' | 'verified' | 'rejected';
    company_type?: string;
    posting_frequency?: string;
    limit?: number;
    page?: number;
  }) => {
    try {
      console.log('[platformAdminApi] Calling /platform-admin/companies with filters:', filters);
      const response = await partyApi.get('/platform-admin/companies', { params: filters });
      console.log('[platformAdminApi] Response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[platformAdminApi] Error in getAllCompanies:', error);
      throw error;
    }
  },

  /**
   * Get company statistics
   */
  getCompanyStats: async () => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/companies/stats');
      const response = await partyApi.get('/platform-admin/companies/stats');
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getCompanyStats:', error);
      throw error;
    }
  },

  /**
   * Get specific company details
   */
  getCompanyById: async (companyId: string) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/companies/:id', companyId);
      const response = await partyApi.get(`/platform-admin/companies/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getCompanyById:', error);
      throw error;
    }
  },

  /**
   * Update company information
   */
  updateCompany: async (companyId: string, data: any) => {
    try {
      console.log('[platformAdminApi] PUT /platform-admin/companies/:id', companyId, data);
      const response = await partyApi.put(`/platform-admin/companies/${companyId}`, data);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in updateCompany:', error);
      throw error;
    }
  },

  /**
   * Delete company
   */
  deleteCompany: async (companyId: string) => {
    try {
      console.log('[platformAdminApi] DELETE /platform-admin/companies/:id', companyId);
      const response = await partyApi.delete(`/platform-admin/companies/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in deleteCompany:', error);
      throw error;
    }
  },

  // ── Verification Management ──

  /**
   * Manually verify or reject a company
   */
  verifyCompany: async (companyId: string, status: 'verified' | 'rejected', reason: string) => {
    try {
      console.log('[platformAdminApi] POST /platform-admin/companies/:id/verify', companyId, { status, reason });
      const response = await partyApi.post(`/platform-admin/companies/${companyId}/verify`, {
        status,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in verifyCompany:', error);
      throw error;
    }
  },

  /**
   * Get verification details for a company
   */
  getVerificationDetails: async (companyId: string) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/companies/:id/verification', companyId);
      const response = await partyApi.get(`/platform-admin/companies/${companyId}/verification`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getVerificationDetails:', error);
      throw error;
    }
  },

  /**
   * Trigger re-verification for a company
   */
  reverifyCompany: async (companyId: string) => {
    try {
      console.log('[platformAdminApi] POST /platform-admin/companies/:id/reverify', companyId);
      const response = await partyApi.post(`/platform-admin/companies/${companyId}/reverify`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in reverifyCompany:', error);
      throw error;
    }
  },

  // ── Search ──

  /**
   * Search company by TIN number
   */
  searchByTIN: async (tinNumber: string) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/companies/search/by-tin/:tinNumber', tinNumber);
      const response = await partyApi.get(`/platform-admin/companies/search/by-tin/${tinNumber}`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in searchByTIN:', error);
      throw error;
    }
  },

  /**
   * Search company by license number
   */
  searchByLicense: async (licenseNumber: string) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/companies/search/by-license/:licenseNumber', licenseNumber);
      const response = await partyApi.get(`/platform-admin/companies/search/by-license/${licenseNumber}`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in searchByLicense:', error);
      throw error;
    }
  },

  // ── Feedback Management ──

  /**
   * Get feedback for a specific company
   */
  getCompanyFeedback: async (companyId: string) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/feedback/companies/:id', companyId);
      const response = await partyApi.get(`/platform-admin/feedback/companies/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getCompanyFeedback:', error);
      throw error;
    }
  },

  /**
   * Get all feedback across platform
   */
  getAllFeedback: async (filters?: { limit?: number; page?: number }) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/feedback/all', filters);
      const response = await partyApi.get('/platform-admin/feedback/all', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getAllFeedback:', error);
      throw error;
    }
  },

  /**
   * Get feedback statistics
   */
  getFeedbackStats: async () => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/feedback/stats');
      const response = await partyApi.get('/platform-admin/feedback/stats');
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getFeedbackStats:', error);
      throw error;
    }
  },

  // ── Reports Management ──

  /**
   * Get reports for a specific company
   */
  getCompanyReports: async (companyId: string) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/feedback/reports/companies/:id', companyId);
      const response = await partyApi.get(`/platform-admin/feedback/reports/companies/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getCompanyReports:', error);
      throw error;
    }
  },

  /**
   * Get all reports across platform
   */
  getAllReports: async (filters?: { status?: string; limit?: number; page?: number }) => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/feedback/reports/all', filters);
      const response = await partyApi.get('/platform-admin/feedback/reports/all', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in getAllReports:', error);
      throw error;
    }
  },

  /**
   * Update report status
   */
  updateReportStatus: async (reportId: string, status: string, notes?: string) => {
    try {
      console.log('[platformAdminApi] PUT /platform-admin/feedback/reports/:id/status', reportId, { status, notes });
      const response = await partyApi.put(`/platform-admin/feedback/reports/${reportId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in updateReportStatus:', error);
      throw error;
    }
  },

  // ── Health Check ──

  /**
   * Check Account service connectivity
   */
  healthCheck: async () => {
    try {
      console.log('[platformAdminApi] GET /platform-admin/feedback/health');
      const response = await partyApi.get('/platform-admin/feedback/health');
      return response.data;
    } catch (error) {
      console.error('[platformAdminApi] Error in healthCheck:', error);
      throw error;
    }
  }
};

export default platformAdminApi;
