import { accountApi, candidateApi, partyApi, jobApi } from './api';

// Account Statistics API
export const accountStatsApi = {
  getStats: async () => {
    const response = await accountApi.get('/accounts/stats');
    return response.data;
  },

  getRecentAccounts: async (limit: number = 10) => {
    const response = await accountApi.get(`/accounts/recent?limit=${limit}`);
    return response.data;
  },

  getActivityLogs: async (page: number = 1, limit: number = 20) => {
    const response = await accountApi.get(`/accounts/activity-logs?page=${page}&limit=${limit}`);
    return response.data;
  }
};

// Candidate Statistics API
export const candidateStatsApi = {
  getStats: async () => {
    const response = await candidateApi.get('/candidate-profiles/stats');
    return response.data;
  },

  getRecentCandidates: async (limit: number = 10) => {
    const response = await candidateApi.get(`/candidate-profiles/recent?limit=${limit}`);
    return response.data;
  },

  getSkillDistribution: async () => {
    const response = await candidateApi.get('/candidate-profiles/skills-distribution');
    return response.data;
  }
};

// Party Statistics API
export const partyStatsApi = {
  getStats: async () => {
    const response = await partyApi.get('/party-profiles/stats');
    return response.data;
  },

  getRecentParties: async (limit: number = 10) => {
    const response = await partyApi.get(`/party-profiles/recent?limit=${limit}`);
    return response.data;
  },

  getTypeDistribution: async () => {
    const response = await partyApi.get('/party-profiles/type-distribution');
    return response.data;
  }
};

// Job Statistics API
export const jobStatsApi = {
  getStats: async () => {
    const response = await jobApi.get('/job-posts/stats');
    return response.data;
  },

  getRecentJobs: async (limit: number = 10) => {
    const response = await jobApi.get(`/job-posts/recent?limit=${limit}`);
    return response.data;
  },

  getCategoryDistribution: async () => {
    const response = await jobApi.get('/job-posts/category-distribution');
    return response.data;
  },

  getApplicationStats: async () => {
    const response = await jobApi.get('/job-posts/application-stats');
    return response.data;
  }
};

// Combined Statistics API
export const combinedStatsApi = {
  getDashboardOverview: async () => {
    const [accounts, candidates, parties, jobs] = await Promise.all([
      accountStatsApi.getStats(),
      candidateStatsApi.getStats(),
      partyStatsApi.getStats(),
      jobStatsApi.getStats()
    ]);

    return {
      accounts,
      candidates,
      parties,
      jobs,
      lastUpdated: new Date().toISOString()
    };
  }
};
