import { logSecurityEvent } from '../services/auditLogger';

interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // milliseconds
  blockDuration?: number; // milliseconds
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  'account-stats': { maxRequests: 10, timeWindow: 60000 },
  'candidate-stats': { maxRequests: 10, timeWindow: 60000 },
  'party-stats': { maxRequests: 10, timeWindow: 60000 },
  'job-stats': { maxRequests: 10, timeWindow: 60000 },
  'dashboard-overview': { maxRequests: 5, timeWindow: 60000 },
  'activity-logs': { maxRequests: 20, timeWindow: 60000 }
};

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private blockedUntil: Map<string, number> = new Map();

  async checkLimit(endpoint: string, config?: RateLimitConfig): Promise<void> {
    const effectiveConfig = config || DEFAULT_CONFIGS[endpoint] || {
      maxRequests: 10,
      timeWindow: 60000
    };

    const key = `${this.getUserId()}-${endpoint}`;
    const now = Date.now();

    // Check if user is blocked
    const blockedUntil = this.blockedUntil.get(key);
    if (blockedUntil && now < blockedUntil) {
      const remainingTime = Math.ceil((blockedUntil - now) / 1000);
      
      await logSecurityEvent({
        action: 'RATE_LIMIT_EXCEEDED',
        resource: endpoint,
        metadata: { remainingTime }
      });

      throw new Error(
        `Rate limit exceeded. Please try again in ${remainingTime} seconds.`
      );
    }

    // Get recent requests
    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter(
      time => now - time < effectiveConfig.timeWindow
    );

    // Check if limit exceeded
    if (recentRequests.length >= effectiveConfig.maxRequests) {
      // Block user if configured
      if (effectiveConfig.blockDuration) {
        this.blockedUntil.set(key, now + effectiveConfig.blockDuration);
      }

      await logSecurityEvent({
        action: 'RATE_LIMIT_EXCEEDED',
        resource: endpoint,
        metadata: {
          requestCount: recentRequests.length,
          maxRequests: effectiveConfig.maxRequests
        }
      });

      throw new Error(
        `Rate limit exceeded. Maximum ${effectiveConfig.maxRequests} requests per minute.`
      );
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
  }

  private getUserId(): string {
    // Get from localStorage or sessionStorage
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'anonymous';
  }

  reset(endpoint?: string): void {
    if (endpoint) {
      const key = `${this.getUserId()}-${endpoint}`;
      this.requests.delete(key);
      this.blockedUntil.delete(key);
    } else {
      this.requests.clear();
      this.blockedUntil.clear();
    }
  }
}

export const rateLimiter = new RateLimiter();
