import { accountApi } from './api';

export const menuConfigApi = {
  getAllMenuConfigs: async () => {
    const response = await accountApi.get('/api/v1/menu-config');
    return response.data;
  },

  getAccessibleMenus: async (filters?: {
    userType?: string;
    workerType?: string;
    subscriptionTier?: string;
    trustScore?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.userType) params.append('userType', filters.userType);
    if (filters?.workerType) params.append('workerType', filters.workerType);
    if (filters?.subscriptionTier) params.append('subscriptionTier', filters.subscriptionTier);
    if (filters?.trustScore !== undefined) params.append('trustScore', String(filters.trustScore));
    
    const queryString = params.toString();
    const url = queryString ? `/api/v1/menu-config/accessible?${queryString}` : '/api/v1/menu-config/accessible';
    const response = await accountApi.get(url);
    return response.data;
  },

  getMenuConfig: async (menuId: string) => {
    const response = await accountApi.get(`/api/v1/menu-config/${menuId}`);
    return response.data;
  },

  createMenuConfig: async (data: any) => {
    const response = await accountApi.post('/api/v1/menu-config', data);
    return response.data;
  },

  updateMenuConfig: async (menuId: string, data: any) => {
    try {
      const payload = data;
      console.log('=== MENU UPDATE REQUEST ===');
      console.log('MenuID:', menuId);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Payload Keys:', Object.keys(payload));
      console.log('========================');
      
      const response = await accountApi.put(`/api/v1/menu-config/${menuId}`, payload);
      console.log('Menu Config Update Success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('=== MENU UPDATE ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Message:', error.response?.data?.message);
      console.error('Validation Errors:', error.response?.data?.validationErrors);
      console.error('Error Data:', error.response?.data);
      console.error('Full Error:', error);
      console.error('========================');
      throw error;
    }
  },

  deleteMenuConfig: async (menuId: string) => {
    const response = await accountApi.delete(`/api/v1/menu-config/${menuId}`);
    return response.data;
  },

  bulkUpdateMenuConfigs: async (updates: any[]) => {
    const response = await accountApi.post('/api/v1/menu-config/bulk-update', updates);
    return response.data;
  },

  seedDefaultMenus: async () => {
    const response = await accountApi.post('/api/v1/menu-config/seed', {});
    return response.data;
  }
};
