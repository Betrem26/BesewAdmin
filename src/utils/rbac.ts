import { store } from '../store/store';

export type Permission =
  | 'VIEW_ACCOUNT_STATISTICS'
  | 'VIEW_CANDIDATE_STATISTICS'
  | 'VIEW_PARTY_STATISTICS'
  | 'VIEW_JOB_STATISTICS'
  | 'VIEW_FINANCIAL_STATISTICS'
  | 'VIEW_ACTIVITY_LOGS'
  | 'EXPORT_STATISTICS'
  | 'MANAGE_USERS'
  | 'MANAGE_ROLES';

export type Role = 'admin' | 'super_admin' | 'manager' | 'analyst' | 'viewer';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'VIEW_ACCOUNT_STATISTICS',
    'VIEW_CANDIDATE_STATISTICS',
    'VIEW_PARTY_STATISTICS',
    'VIEW_JOB_STATISTICS',
    'VIEW_FINANCIAL_STATISTICS',
    'VIEW_ACTIVITY_LOGS',
    'EXPORT_STATISTICS',
    'MANAGE_USERS',
    'MANAGE_ROLES'
  ],
  admin: [
    'VIEW_ACCOUNT_STATISTICS',
    'VIEW_CANDIDATE_STATISTICS',
    'VIEW_PARTY_STATISTICS',
    'VIEW_JOB_STATISTICS',
    'VIEW_FINANCIAL_STATISTICS',
    'VIEW_ACTIVITY_LOGS',
    'EXPORT_STATISTICS'
  ],
  manager: [
    'VIEW_ACCOUNT_STATISTICS',
    'VIEW_CANDIDATE_STATISTICS',
    'VIEW_PARTY_STATISTICS',
    'VIEW_JOB_STATISTICS',
    'VIEW_ACTIVITY_LOGS'
  ],
  analyst: [
    'VIEW_ACCOUNT_STATISTICS',
    'VIEW_CANDIDATE_STATISTICS',
    'VIEW_JOB_STATISTICS'
  ],
  viewer: [
    'VIEW_ACCOUNT_STATISTICS',
    'VIEW_CANDIDATE_STATISTICS'
  ]
};

class RBACManager {
  private permissionCache: Map<string, { result: boolean; timestamp: number }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  checkPermission(permission: Permission): boolean {
    const cacheKey = `${this.getCurrentUserId()}-${permission}`;
    const cached = this.permissionCache.get(cacheKey);

    // Return cached result if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.result;
    }

    // Check permission
    const result = this.hasPermission(permission);

    // Cache result
    this.permissionCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    return result;
  }

  private hasPermission(permission: Permission): boolean {
    const state = store.getState() as any;
    const userRole = state.user?.role as Role;

    // Super admin has all permissions
    if (userRole === 'super_admin') return true;

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
  }

  private getCurrentUserId(): string {
    const state = store.getState() as any;
    return state.user?.userId || 'anonymous';
  }

  clearCache(): void {
    this.permissionCache.clear();
  }
}

export const rbacManager = new RBACManager();

export const checkPermission = (permission: Permission): boolean => {
  return rbacManager.checkPermission(permission);
};

export const requirePermission = (permission: Permission): void => {
  if (!checkPermission(permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
};
