import { jobApi, handleApiError } from './api';

export const vacancyTemplateApi = {
  getAllTemplates: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancy-template', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createTemplate: async (data: any) => {
    try {
      const response = await jobApi.post('/vacancy-template', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getTemplateById: async (id: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancy-template/${id}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateTemplate: async (id: string, data: any) => {
    try {
      const response = await jobApi.put(`/vacancy-template/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteTemplate: async (id: string) => {
    try {
      const response = await jobApi.delete(`/vacancy-template/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
