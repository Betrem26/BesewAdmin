import { jobApi, handleApiError } from './api';

export const scheduledPostsApi = {
  getAllScheduledPosts: async (params?: any) => {
    try {
      const response = await jobApi.get('/scheduled-posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createScheduledPost: async (data: any) => {
    try {
      const response = await jobApi.post('/scheduled-posts', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getScheduledPostById: async (id: string, params?: any) => {
    try {
      const response = await jobApi.get(`/scheduled-posts/${id}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateScheduledPost: async (id: string, data: any) => {
    try {
      const response = await jobApi.put(`/scheduled-posts/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteScheduledPost: async (id: string) => {
    try {
      const response = await jobApi.delete(`/scheduled-posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getScheduledPostsCount: async (month: string) => {
    try {
      const response = await jobApi.get(`/scheduled-posts/count/${month}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getScheduleByVacancyId: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/scheduled-posts/schedule-by-vacancyid/${vacancyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
