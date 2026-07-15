import apiClient from './client';

export const usersApi = {
  getAllUsers: async (params) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data; 
  },
  inviteAdmin: async (payload) => {
    const response = await apiClient.post('/admin/users/invite', payload);
    return response.data;
  },
  updateUserStatus: async (id, status) => {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },
  updateSystemRole: async (id, systemRoleSlug) => {
    const response = await apiClient.patch(`/admin/users/${id}/system-role`, { systemRoleSlug });
    return response.data;
  },
  assignFunctionalRoles: async (id, functionalRoleIds) => {
    const response = await apiClient.post(`/admin/users/${id}/functional-roles`, { functionalRoleIds });
    return response.data;
  },
  getUserFunctionalRoles: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}/functional-roles`);
    return response.data;
  },
  getUserDetails: async (id) => {
    const res = await apiClient.get(`/admin/users/${id}/details`);
    return res.data;
  },
  revokeSessions: async (id) => {
    const res = await apiClient.post(`/admin/users/${id}/revoke-sessions`);
    return res.data;
  },
  cancelInvite: async (email) => {
    const res = await apiClient.delete('/admin/users/invite/cancel', { data: { email } });
    return res.data;
  },
};