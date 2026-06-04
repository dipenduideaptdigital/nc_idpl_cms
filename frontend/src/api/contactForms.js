import apiClient from './client';

export const contactFormsApi = {
  getForms: async () => {
    const response = await apiClient.get('/admin/contact-forms');
    return response.data;
  },

  getFormById: async (id) => {
    const response = await apiClient.get(`/admin/contact-forms/${id}`);
    return response.data;
  },

  createForm: async (formData) => {
    const response = await apiClient.post('/admin/contact-forms', formData);
    return response.data;
  },

  updateForm: async (id, formData) => {
    const response = await apiClient.patch(`/admin/contact-forms/${id}`, formData);
    return response.data;
  },

  deleteForm: async (id) => {
    const response = await apiClient.delete(`/admin/contact-forms/${id}`);
    return response.data;
  },
};