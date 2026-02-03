// OTP Management API Service
import { accountApi, handleApiError } from './api';

export interface ResetRateLimitDto {
  phoneNumber: string;
  reason: string;
}

export interface RateLimitStatus {
  phoneNumber: string;
  isBlocked: boolean;
  attemptCount: number;
  lastAttempt?: string;
  blockExpiresAt?: string;
}

export interface BlockedNumber {
  phoneNumber: string;
  blockedAt: string;
  attemptCount: number;
  expiresAt: string;
}

export const otpManagementApi = {
  /**
   * Reset OTP rate limit for a phone number (Admin only)
   */
  resetRateLimit: async (data: ResetRateLimitDto): Promise<{
    success: boolean;
    message: string;
    phoneNumber: string;
    resetAt: string;
    clearedRecords: number;
  }> => {
    try {
      const response = await accountApi.post('/admin/otp/reset-rate-limit', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get rate limit status for a phone number (Admin only)
   */
  getRateLimitStatus: async (phoneNumber: string): Promise<RateLimitStatus> => {
    try {
      const response = await accountApi.get<RateLimitStatus>(
        `/admin/otp/rate-limit-status?phoneNumber=${encodeURIComponent(phoneNumber)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get list of currently blocked phone numbers (Admin only)
   */
  getBlockedNumbers: async (): Promise<{
    blockedNumbers: BlockedNumber[];
    totalBlocked: number;
  }> => {
    try {
      const response = await accountApi.get('/admin/otp/blocked-numbers');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Reset general rate limit (Admin only)
   */
  resetGeneralRateLimit: async (phoneNumber: string): Promise<{
    success: boolean;
    message: string;
    details: any;
  }> => {
    try {
      const response = await accountApi.post('/admin/rate-limit/reset', { phoneNumber });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
