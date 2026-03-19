import { jobApi, handleApiError } from './api';

export const jobPostsApi = {
  getAllPosts: async (params?: any) => {
    try {
      const response = await jobApi.get('/posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createPost: async (data: any) => {
    try {
      const response = await jobApi.post('/posts', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updatePost: async (postId: string, data: any) => {
    try {
      const response = await jobApi.patch(`/posts/${postId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getStartupPosts: async (params?: any) => {
    try {
      const response = await jobApi.get('/posts/startupposts', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMyTransferRequests: async (params?: any) => {
    try {
      const response = await jobApi.get('/posts/mytransferrequests', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getTransferredToMyAgency: async (params?: any) => {
    try {
      const response = await jobApi.get('/posts/transfered-to-my-agency', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getPostById: async (id: string, params?: any) => {
    try {
      const response = await jobApi.get(`/posts/${id}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deletePost: async (id: string) => {
    try {
      const response = await jobApi.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getVacancyEscrowDetails: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/posts/${vacancyId}/escrow-details`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getPostsByCompany: async (companyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/posts/company/${companyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getPostsByCategory: async (categoryId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/posts/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getActivePosts: async (params?: any) => {
    try {
      const response = await jobApi.get('/posts/active', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMyUnexpiredJobs: async (params?: any) => {
    try {
      const response = await jobApi.get('/posts/my-unexpired-jobs', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
