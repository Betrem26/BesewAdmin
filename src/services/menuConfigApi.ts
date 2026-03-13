import { accountApi } from './api';

export const menuConfigApi = {
  getAllMenuConfigs: async () => {
    const response = await accountApi.get('/api/v1/menu-config');
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
    const response = await accountApi.put(`/api/v1/menu-config/${menuId}`, data);
    return response.data;
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
