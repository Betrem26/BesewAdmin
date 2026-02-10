import { accountApi, handleApiError } from './api';

export interface Role {
    _id: string;
    name: string;
    displayName: string;
    description?: string;
    permissions: string[];
    hierarchyLevel: number;
    isSystem: boolean;
    isActive: boolean;
    userCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export const rolesApi = {
    /**
     * Get all roles
     */
    getAllRoles: async (includeInactive = false): Promise<Role[]> => {
        try {
            const response = await accountApi.get(`/roles?includeInactive=${includeInactive}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get roles with user count statistics
     */
    getRolesWithStats: async (includeInactive = false): Promise<Role[]> => {
        try {
            const response = await accountApi.get(`/roles/stats?includeInactive=${includeInactive}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get a single role by ID
     */
    getRoleById: async (id: string): Promise<Role> => {
        try {
            const response = await accountApi.get(`/roles/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Create a new role
     */
    createRole: async (roleData: Partial<Role>): Promise<Role> => {
        try {
            const response = await accountApi.post('/roles', roleData);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update an existing role
     */
    updateRole: async (id: string, roleData: Partial<Role>): Promise<Role> => {
        try {
            const response = await accountApi.put(`/roles/${id}`, roleData);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Delete a role
     */
    deleteRole: async (id: string): Promise<void> => {
        try {
            await accountApi.delete(`/roles/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get all available permissions
     */
    getAllPermissions: async (): Promise<string[]> => {
        try {
            const response = await accountApi.get('/roles/permissions/all');
            return response.data.permissions;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Seed initial roles
     */
    seedRoles: async (): Promise<{ message: string }> => {
        try {
            const response = await accountApi.post('/roles/seed');
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};
