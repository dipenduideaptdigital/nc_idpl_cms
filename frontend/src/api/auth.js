import apiClient from './client';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  adminLogin: async (credentials) => {
    const response = await apiClient.post('/auth/admin-login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  setupAdminAccount: async (payload) => {
    const response = await apiClient.post('/auth/setup-admin', payload);
    return response.data;
  }
};