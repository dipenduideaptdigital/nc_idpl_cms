import apiClient from './client';

export const adminDynamicFormsApi = {
  createForm: async (payload) => {
    const response = await apiClient.post('/admin/dynamic-forms', payload);
    return response.data;
  },

  updateForm: async (id, payload) => {
    const response = await apiClient.patch(`/admin/dynamic-forms/${id}`, payload);
    return response.data;
  },

  getForm: async (id) => {
    const response = await apiClient.get(`/admin/dynamic-forms/${id}`);
    return response.data;
  },
  getAdminForms: async (params = {}) => {
    const response = await apiClient.get('/admin/dynamic-forms', { params });
    return response.data;
  },

  getSubmissions: async (formId, params = {}) => {
    const response = await apiClient.get(`/admin/dynamic-forms/${formId}/submissions`, { params });
    return response.data;
  },

  getSubmissionDetails: async (subId) => {
    const response = await apiClient.get(`/admin/dynamic-forms/submissions/${subId}`);
    return response.data;
  },

  updateSubmissionStatus: async (subId, status) => {
    const response = await apiClient.patch(`/admin/dynamic-forms/submissions/${subId}/status`, { status });
    return response.data;
  },

  addSubmissionNote: async (subId, text) => {
    const response = await apiClient.post(`/admin/dynamic-forms/submissions/${subId}/notes`, { text });
    return response.data;
  },
  
  deleteSubmission: async (subId) => {
    const response = await apiClient.delete(`/admin/dynamic-forms/submissions/${subId}`);
    return response.data;
  }
};