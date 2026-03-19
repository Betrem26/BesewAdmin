import { jobApi, handleApiError } from './api';

export const jobVacanciesApi = {
  getPublicVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/public/list', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getDetailedPublicVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/public/posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getJobPostsFromModel: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/public/job-posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getPublicDebugJobPosts: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/public/debug/job-posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getAllVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createVacancy: async (data: any) => {
    try {
      const response = await jobApi.post('/vacancies', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getVacanciesByCompany: async (companyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancies/company/${companyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getVacanciesByCategory: async (categoryId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancies/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getVacanciesByLocation: async (locationId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancies/location/${locationId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  searchVacancies: async (keyword: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancies/search/${keyword}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateVacancy: async (vacancyId: string, data: any) => {
    try {
      const response = await jobApi.put(`/vacancies/${vacancyId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteVacancy: async (vacancyId: string) => {
    try {
      const response = await jobApi.delete(`/vacancies/${vacancyId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getVerifiedVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/vacancies/verified', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getPostedVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/vacancies/posted', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getExpiredVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/vacancies/filter-expired', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getNotExpiredVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/vacancies/filter-not-expired', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getEmployeePerfVacancyCount: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/employee-perf/vacancy-count', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMyVacancies: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/my-vacancies', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getVacanciesForPosting: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/for-posting', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getVacanciesByJobId: async (jobId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancies/job/${jobId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  checkBackgroundServicesHealth: async () => {
    try {
      const response = await jobApi.get('/vacancies/health/background-services');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getPublicVacancyById: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancies/public/vacancies/${vacancyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getAuthenticatedVacancyById: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/vacancies/vacancies/${vacancyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMyVacancyRequests: async (params?: any) => {
    try {
      const response = await jobApi.get('/vacancies/my-vacancy-requests', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
