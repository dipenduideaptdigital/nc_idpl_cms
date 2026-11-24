import apiClient from './client';

export const faqsApi = {
  getAdminCategories: async () => {
    const response = await apiClient.get(
      '/admin/faqs/categories'
    );
    return response.data;
  },

  createCategory: async (data) => {
    const response = await apiClient.post(
      '/admin/faqs/categories',
      data
    );
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await apiClient.patch(
      `/admin/faqs/categories/${id}`,
      data
    );
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(
      `/admin/faqs/categories/${id}`
    );
    return response.data;
  },

  getAdminQuestions: async (params = {}) => {
    const response = await apiClient.get(
      '/admin/faqs/questions',
      { params }
    );
    return response.data;
  },

  createQuestion: async (data) => {
    const response = await apiClient.post(
      '/admin/faqs/questions',
      data
    );
    return response.data;
  },

  updateQuestion: async (id, data) => {
    const response = await apiClient.patch(
      `/admin/faqs/questions/${id}`,
      data
    );
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await apiClient.delete(
      `/admin/faqs/questions/${id}`
    );
    return response.data;
  },

  reorder: async (type, items) => {
    const response = await apiClient.patch(
      '/admin/faqs/reorder',
      { items },
      { params: { type } }
    );
    return response.data;
  },

  getPublicFaqs: async (signal) => {
    const response = await apiClient.get(
      '/faqs',
      { signal }
    );
    return response.data;
  },
};