import { jobApi, handleApiError } from './api';

export const vacancyStatusApi = {
  getAllStatuses: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancy-statuses', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getJobsStatus: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancy-statuses/jobs-status', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMyVacanciesStatus: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancy-statuses/my-vacancies', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getStatusById: async (id: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancy-statuses/${id}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  verifyVacancy: async (vacancyId: string) => {
    try {
      const response = await jobApi.post(`/vacancy-statuses/${vacancyId}/verify`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  postVerifiedVacancy: async (vacancyId: string) => {
    try {
      const response = await jobApi.post(`/vacancy-statuses/${vacancyId}/post`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  suspendVacancy: async (vacancyId: string) => {
    try {
      const response = await jobApi.post(`/vacancy-statuses/${vacancyId}/suspend`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  extendVacancy: async (vacancyId: string, data: any) => {
    try {
      const response = await jobApi.post(`/vacancy-statuses/${vacancyId}/extend`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  repostVacancy: async (vacancyId: string, data: any) => {
    try {
      const response = await jobApi.post(`/vacancy-statuses/${vacancyId}/repost`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  revokeVacancy: async (vacancyId: string, data: any) => {
    try {
      const response = await jobApi.post(`/vacancy-statuses/${vacancyId}/revoke`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
