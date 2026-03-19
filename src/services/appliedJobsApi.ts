import { jobApi, handleApiError } from './api';

export const appliedJobsApi = {
  getAllApplications: async (params?: any) => {
    try {
      const response = await jobApi.get('/applied-jobs', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  applyToJob: async (data: any) => {
    try {
      const response = await jobApi.post('/applied-jobs', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getApplicationById: async (id: string, params?: any) => {
    try {
      const response = await jobApi.get(`/applied-jobs/${id}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateApplication: async (id: string, data: any) => {
    try {
      const response = await jobApi.put(`/applied-jobs/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteApplication: async (id: string) => {
    try {
      const response = await jobApi.delete(`/applied-jobs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  applyForJobCustom: async (data: any) => {
    try {
      const response = await jobApi.post('/applied-jobs/apply-for-job', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getJobApplicantsStatus: async (params?: any) => {
    try {
      const response = await jobApi.get('/applied-jobs/job-applicants-status', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getApplicantsByVacancyId: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/applied-jobs/job-applicants/${vacancyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getApplicantsAlt: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/applied-jobs/applicants/${vacancyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getAppliedCandidates: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/applied-jobs/get-applied-candidates/${vacancyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateApplicationStatus: async (id: string, status: string) => {
    try {
      const response = await jobApi.patch(`/applied-jobs/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getShortlistedCandidates: async (vacancyId: string, params?: any) => {
    try {
      const response = await jobApi.get(`/applied-jobs/get-shortlisted-candidates/${vacancyId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  checkCandidateAccess: async (candidatePartyId: string) => {
    try {
      const response = await jobApi.get(`/applied-jobs/check-access/${candidatePartyId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
