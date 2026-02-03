// Comprehensive monitoring API service for all backend services
import { 
  accountApi, 
  jobApi, 
  partyApi, 
  candidateApi, 
  commissionApi, 
  employeeApi, 
  notificationApi, 
  psychometricApi,
  handleApiError 
} from './api';

// Account Service Monitoring
export const accountMonitoringApi = {
  // Get account statistics
  getAccountStats: async () => {
    try {
      const response = await accountApi.get('/accounts/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent registrations
  getRecentRegistrations: async (limit: number = 10) => {
    try {
      const response = await accountApi.get(`/accounts/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get user activity logs
  getUserActivityLogs: async (page: number = 1, limit: number = 20) => {
    try {
      const response = await accountApi.get(`/accounts/activity-logs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get authentication metrics
  getAuthMetrics: async () => {
    try {
      const response = await accountApi.get('/auth/metrics');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get OTP statistics
  getOTPStats: async () => {
    try {
      const response = await accountApi.get('/otp/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Job Service Monitoring
export const jobMonitoringApi = {
  // Get job posting statistics
  getJobStats: async () => {
    try {
      const response = await jobApi.get('/posts/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent job postings
  getRecentJobs: async (limit: number = 10) => {
    try {
      const response = await jobApi.get(`/posts/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get job application statistics
  getApplicationStats: async () => {
    try {
      const response = await jobApi.get('/applications/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get job category statistics
  getCategoryStats: async () => {
    try {
      const response = await jobApi.get('/categories/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get job performance metrics
  getJobPerformanceMetrics: async () => {
    try {
      const response = await jobApi.get('/posts/performance-metrics');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Party Service Monitoring (Startups/Organizations)
export const partyMonitoringApi = {
  // Get party profile statistics
  getPartyStats: async () => {
    try {
      const response = await partyApi.get('/party-profiles/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent party registrations
  getRecentParties: async (limit: number = 10) => {
    try {
      const response = await partyApi.get(`/party-profiles/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get verification statistics
  getVerificationStats: async () => {
    try {
      const response = await partyApi.get('/party-profiles/verification-stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get company data statistics
  getCompanyDataStats: async () => {
    try {
      const response = await partyApi.get('/company-data/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Candidate Service Monitoring
export const candidateMonitoringApi = {
  // Get candidate statistics
  getCandidateStats: async () => {
    try {
      const response = await candidateApi.get('/candidate-profiles/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent candidate registrations
  getRecentCandidates: async (limit: number = 10) => {
    try {
      const response = await candidateApi.get(`/candidate-profiles/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get candidate activity metrics
  getCandidateActivityMetrics: async () => {
    try {
      const response = await candidateApi.get('/candidate-profiles/activity-metrics');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get skill distribution
  getSkillDistribution: async () => {
    try {
      const response = await candidateApi.get('/candidate-profiles/skill-distribution');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Commission Service Monitoring
export const commissionMonitoringApi = {
  // Get commission statistics
  getCommissionStats: async () => {
    try {
      const response = await commissionApi.get('/commissions/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get revenue metrics
  getRevenueMetrics: async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    try {
      const response = await commissionApi.get(`/commissions/revenue-metrics?period=${period}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get payment statistics
  getPaymentStats: async () => {
    try {
      const response = await commissionApi.get('/commissions/payment-stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent transactions
  getRecentTransactions: async (limit: number = 10) => {
    try {
      const response = await commissionApi.get(`/commissions/recent-transactions?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Notification Service Monitoring
export const notificationMonitoringApi = {
  // Get notification statistics
  getNotificationStats: async () => {
    try {
      const response = await notificationApi.get('/notifications/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get delivery metrics
  getDeliveryMetrics: async () => {
    try {
      const response = await notificationApi.get('/notifications/delivery-metrics');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get channel statistics (SMS, Email, Push)
  getChannelStats: async () => {
    try {
      const response = await notificationApi.get('/notifications/channel-stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent notifications
  getRecentNotifications: async (limit: number = 10) => {
    try {
      const response = await notificationApi.get(`/notifications/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Psychometric Service Monitoring
export const psychometricMonitoringApi = {
  // Get psychometric test statistics
  getPsychometricStats: async () => {
    try {
      const response = await psychometricApi.get('/assessments/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get test completion metrics
  getCompletionMetrics: async () => {
    try {
      const response = await psychometricApi.get('/assessments/completion-metrics');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get skill assessment distribution
  getSkillAssessmentDistribution: async () => {
    try {
      const response = await psychometricApi.get('/assessments/skill-distribution');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent assessments
  getRecentAssessments: async (limit: number = 10) => {
    try {
      const response = await psychometricApi.get(`/assessments/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Employee Service Monitoring
export const employeeMonitoringApi = {
  // Get employee statistics
  getEmployeeStats: async () => {
    try {
      const response = await employeeApi.get('/employee-profiles/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recent employee registrations
  getRecentEmployees: async (limit: number = 10) => {
    try {
      const response = await employeeApi.get(`/employee-profiles/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get employee activity metrics
  getEmployeeActivityMetrics: async () => {
    try {
      const response = await employeeApi.get('/employee-profiles/activity-metrics');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// System Health Monitoring
export const systemHealthApi = {
  // Check all services health
  checkAllServicesHealth: async () => {
    const services = [
      { name: 'Account', api: accountApi, endpoint: '/health' },
      { name: 'Job', api: jobApi, endpoint: '/health' },
      { name: 'Party', api: partyApi, endpoint: '/health' },
      { name: 'Candidate', api: candidateApi, endpoint: '/health' },
      { name: 'Commission', api: commissionApi, endpoint: '/health' },
      { name: 'Employee', api: employeeApi, endpoint: '/health' },
      { name: 'Notification', api: notificationApi, endpoint: '/health' },
      { name: 'Psychometric', api: psychometricApi, endpoint: '/health' },
    ];

    const healthChecks = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const response = await service.api.get(service.endpoint);
          return {
            service: service.name,
            status: 'healthy',
            response_time: response.headers['x-response-time'] || 'N/A',
            data: response.data,
          };
        } catch (error) {
          return {
            service: service.name,
            status: 'unhealthy',
            error: handleApiError(error),
          };
        }
      })
    );

    return healthChecks.map((result, index) => ({
      service: services[index].name,
      ...(result.status === 'fulfilled' ? result.value : { status: 'error', error: 'Failed to check' }),
    }));
  },

  // Get aggregated system metrics
  getSystemMetrics: async () => {
    try {
      const [accountStats, jobStats, partyStats, candidateStats] = await Promise.allSettled([
        accountMonitoringApi.getAccountStats(),
        jobMonitoringApi.getJobStats(),
        partyMonitoringApi.getPartyStats(),
        candidateMonitoringApi.getCandidateStats(),
      ]);

      return {
        account: accountStats.status === 'fulfilled' ? accountStats.value : null,
        job: jobStats.status === 'fulfilled' ? jobStats.value : null,
        party: partyStats.status === 'fulfilled' ? partyStats.value : null,
        candidate: candidateStats.status === 'fulfilled' ? candidateStats.value : null,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Export all monitoring APIs
export default {
  account: accountMonitoringApi,
  job: jobMonitoringApi,
  party: partyMonitoringApi,
  candidate: candidateMonitoringApi,
  commission: commissionMonitoringApi,
  notification: notificationMonitoringApi,
  psychometric: psychometricMonitoringApi,
  employee: employeeMonitoringApi,
  system: systemHealthApi,
};
