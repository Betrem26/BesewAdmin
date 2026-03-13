import { accountApi } from './api';

export const getRoles = async () => {
  const response = await accountApi.get('/api/v1/roles');
  return response.data;
};

export const getRoleById = async (id: string) => {
  const response = await accountApi.get(`/api/v1/roles/${id}`);
  return response.data;
};

export const createRole = async (data: any) => {
  const response = await accountApi.post('/api/v1/roles', data);
  return response.data;
};

export const updateRole = async (id: string, data: any) => {
  const response = await accountApi.put(`/api/v1/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await accountApi.delete(`/api/v1/roles/${id}`);
  return response.data;
};
