import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://account.besewonline.com';

export const menuConfigApi = {
  getAllMenuConfigs: async (token: string) => {
    const response = await axios.get(`${API_BASE}/api/v1/menu-config`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getMenuConfig: async (menuId: string, token: string) => {
    const response = await axios.get(`${API_BASE}/api/v1/menu-config/${menuId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createMenuConfig: async (data: any, token: string) => {
    const response = await axios.post(`${API_BASE}/api/v1/menu-config`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateMenuConfig: async (menuId: string, data: any, token: string) => {
    const response = await axios.put(`${API_BASE}/api/v1/menu-config/${menuId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteMenuConfig: async (menuId: string, token: string) => {
    const response = await axios.delete(`${API_BASE}/api/v1/menu-config/${menuId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  bulkUpdateMenuConfigs: async (updates: any[], token: string) => {
    const response = await axios.post(`${API_BASE}/api/v1/menu-config/bulk-update`, updates, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  seedDefaultMenus: async (token: string) => {
    const response = await axios.post(`${API_BASE}/api/v1/menu-config/seed`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
