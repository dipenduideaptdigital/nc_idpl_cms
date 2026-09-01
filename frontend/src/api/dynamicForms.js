import apiClient from './client';

export const dynamicFormsApi = {
  getPublicForm: async (slug) => {
    const response = await apiClient.get(`/dynamic-forms/${slug}`);
    return response.data;
  },

  submitForm: async (slug, payload) => {
    const response = await apiClient.post(`/dynamic-forms/${slug}/submit`, { payload });
    return response.data;
  },

  getPublishedFormsList: async () => {
    const response = await apiClient.get('/admin/dynamic-forms/published-list');
    return response.data;
  }
};