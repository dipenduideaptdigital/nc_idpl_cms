import apiClient from './client';

export const rolesApi = {
  getAllRoles: async () => {
    const response = await apiClient.get('/admin/roles');
    return response.data;
  },
  
  getRoleById: async (id) => {
    const response = await apiClient.get(`/admin/roles/${id}`);
    return response.data;
  },

  getSystemPermissions: async () => {
    const response = await apiClient.get('/admin/roles/permissions');
    return response.data;
  },

  createRole: async (payload) => {
    const response = await apiClient.post('/admin/roles', payload);
    return response.data;
  },

  updateRole: async (id, payload) => {
    const response = await apiClient.patch(`/admin/roles/${id}`, payload);
    return response.data;
  },

  deleteRole: async (id) => {
    const response = await apiClient.delete(`/admin/roles/${id}`);
    return response.data;
  }
};