import { jobApi, handleApiError } from './api';

export interface JobCommon {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  langOpt?: string;
  [key: string]: any;
}

export const jobCommonApi = {
  getAllCommonJobs: async (params?: any) => {
    try {
      const response = await jobApi.get('/job-common', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  createCommonJob: async (data: any) => {
    try {
      const response = await jobApi.post('/job-common', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getCategoryByLanguage: async (params?: any) => {
    try {
      const response = await jobApi.get('/job-common/catagory-by-language', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getCategoryByName: async (name: string) => {
    try {
      const response = await jobApi.get(`/job-common/category/name/${name}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  findByPartyId: async (partyId: string) => {
    try {
      const response = await jobApi.get(`/job-common/find-by-partyId/${partyId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getJobListsByCategory: async (category: string) => {
    try {
      const response = await jobApi.get(`/job-common/job-lists/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getJobTitleByCategory: async (category: string) => {
    try {
      const response = await jobApi.get(`/job-common/job-title-by-category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateCommonJob: async (id: string, data: any) => {
    try {
      const response = await jobApi.put(`/job-common/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteCommonJob: async (id: string) => {
    try {
      const response = await jobApi.delete(`/job-common/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getJobsAddedByAdmin: async (data?: any) => {
    try {
      const response = await jobApi.post('/job-common/added-by-admin', data || {});
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getJobByTitle: async (jobTitle: string) => {
    try {
      const response = await jobApi.get(`/job-common/get-job-by-title/${jobTitle}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  generateAIJobDefinition: async (data: any) => {
    try {
      const response = await jobApi.post('/job-common/generate', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
