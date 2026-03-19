import { jobApi, handleApiError } from './api';

export const applicantJobTransfersApi = {
  getAllTransfers: async (params?: any) => {
    try {
      const response = await jobApi.get('/applicant-job-transfers', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createTransfer: async (data: any) => {
    try {
      const response = await jobApi.post('/applicant-job-transfers', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getTransferById: async (id: string, params?: any) => {
    try {
      const response = await jobApi.get(`/applicant-job-transfers/${id}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateTransfer: async (id: string, data: any) => {
    try {
      const response = await jobApi.put(`/applicant-job-transfers/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteTransfer: async (id: string) => {
    try {
      const response = await jobApi.delete(`/applicant-job-transfers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
