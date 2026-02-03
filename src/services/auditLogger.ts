import { accountApi } from './api';
import { store } from '../store/store';

export interface SecurityEvent {
  eventId: string;
  timestamp: string;
  userId: string;
  action: SecurityEventAction;
  resource: string;
  ipAddress: string;
  userAgent: string;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export type SecurityEventAction =
  | 'STATISTICS_ACCESS'
  | 'STATISTICS_ACCESS_SUCCESS'
  | 'STATISTICS_ACCESS_FAILED'
  | 'PERMISSION_DENIED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_INPUT'
  | 'MFA_REQUIRED'
  | 'MFA_VERIFIED'
  | 'MFA_FAILED';

class AuditLogger {
  private eventQueue: SecurityEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private maxQueueSize: number = 50;
  private flushTimer: any = null;

  constructor() {
    this.startFlushTimer();
  }

  async logEvent(event: Partial<SecurityEvent>): Promise<void> {
    const fullEvent: SecurityEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      action: event.action || 'STATISTICS_ACCESS',
      resource: event.resource || 'unknown',
      ...event
    } as SecurityEvent;

    this.eventQueue.push(fullEvent);

    // Flush immediately if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      await this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await accountApi.post('/audit/batch-log', {
        events: eventsToSend
      });
    } catch (error) {
      console.error('Failed to send audit logs:', error);
      // Re-queue events on failure (keep last 100 events max)
      this.eventQueue.unshift(...eventsToSend.slice(-100));
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string {
    const state = store.getState() as any;
    return state.user?.userId || 'anonymous';
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        timeout: 2000
      } as any);
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(); // Final flush
  }
}

export const auditLogger = new AuditLogger();

// Convenience functions
export const logSecurityEvent = (event: Partial<SecurityEvent>) => {
  return auditLogger.logEvent(event);
};
