import { accountApi } from './api';

const BASE = '/subscription-options';

export const subscriptionApi = {
  getAll: () => accountApi.get(BASE),
  getById: (id: string) => accountApi.get(`${BASE}/${id}`),
  getTypes: () => accountApi.get(`${BASE}/types`),
  getPeriods: () => accountApi.get(`${BASE}/periods`),
  getFeatures: (type?: string) => accountApi.get(`${BASE}/features`, { params: type ? { type } : {} }),
  getPopular: () => accountApi.get(`${BASE}/popular`),
  getRecommended: () => accountApi.get(`${BASE}/recommended`),
  create: (data: any) => accountApi.post(BASE, data),
  update: (id: string, data: any) => accountApi.put(`${BASE}/${id}`, data),
  toggleActive: (id: string) => accountApi.put(`${BASE}/${id}/toggle-active`),
};
