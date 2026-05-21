/**
 * Menu Configuration Types
 */

export interface MenuConfig {
  menuId: string;
  label: string;
  path: string;
  icon?: string | null;
  description?: string | null;
  badge?: string | null;
  isActive: boolean;
  allowedUserTypes: string[];
  allowedWorkerTypes: string[];
  minTrustScore: number;
  allowedSubscriptionTiers: string[];
  order: number;
  parentMenuId?: string | null;
  _id?: string; // MongoDB ID
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuFilters {
  userType?: string;
  workerType?: string;
  subscriptionTier?: string;
  trustScore?: number;
}

export interface MenuConfigState {
  items: MenuConfig[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

export enum UserType {
  JOB_SEEKER = 'JOB_SEEKER',
  GIG_WORKER = 'GIG_WORKER',
  EMPLOYER = 'EMPLOYER',
  AGGREGATOR = 'AGGREGATOR',
  STARTUP_FOUNDER = 'STARTUP_FOUNDER',
  ADMIN = 'ADMIN'
}

export enum WorkerType {
  EMPLOYEE = 'EMPLOYEE',
  FREELANCER = 'FREELANCER',
  BOTH = 'BOTH',
  CONSULTANT = 'CONSULTANT',
  CONTRACTOR = 'CONTRACTOR'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  TRIAL = 'TRIAL',
  STANDARD = 'STANDARD',
  GROWTH = 'GROWTH',
  PROFESSIONAL = 'PROFESSIONAL',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface MenuValidationError {
  field: string;
  message: string;
}
