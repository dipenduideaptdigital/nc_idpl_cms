import apiClient from './client';

export const contactsApi = {
  submitContactForm: async (payload) => {
    const response = await apiClient.post('/contacts/submit', payload);
    return response.data;
  },

  getSubmissions: async (params) => {
    const res = await apiClient.get('/admin/contacts/submissions', { params });
    return res.data;
  },

  getSubmissionDetails: async (id) => {
    const res = await apiClient.get(`/admin/contacts/submissions/${id}`);
    return res.data;
  },

  updateStatus: async (id, status, note = '') => {
    const res = await apiClient.patch(`/admin/contacts/submissions/${id}/status`, { status, note });
    return res.data;
  },

  addInternalNote: async (id, note) => {
    const res = await apiClient.post(`/admin/contacts/submissions/${id}/notes`, { note });
    return res.data;
  },

  deleteSubmission: async (id) => {
    const res = await apiClient.delete(`/admin/contacts/submissions/${id}`);
    return res.data;
  },

  getMetrics: async () => {
    const res = await apiClient.get('/admin/contacts/metrics');
    return res.data;
  },

  cancelInvite: async (email) => {
    const res = await apiClient.delete('/admin/contacts/invite/cancel', { data: { email } });
    return res.data;
  }
};