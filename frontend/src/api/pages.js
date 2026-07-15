import apiClient from './client';

export const pagesApi = {
  getPages: async (params = {}) => {
    const response = await apiClient.get('/admin/pages', { params });
    return response.data;
  },

  getPageById: async (id) => {
    const response = await apiClient.get(`/admin/pages/${id}`);
    return response.data;
  },

  createPage: async (pageData) => {
    const response = await apiClient.post('/admin/pages', pageData);
    return response.data;
  },

  updatePage: async (id, pageData) => {
    const response = await apiClient.patch(`/admin/pages/${id}`, pageData);
    return response.data;
  },

  deletePage: async (id) => {
    const response = await apiClient.delete(`/admin/pages/${id}`);
    return response.data;
  },

  getPublicPages: async (params = {}) => {
    const response = await apiClient.get('/pages', { params });
    return response.data;
  },

  getPublicPageBySlug: async (slug) => {
    const response = await apiClient.get(`/pages/${slug}`);
    return response.data;
  },

  generatePreviewLink: async (id) => {
    const response = await apiClient.post(`/admin/pages/${id}/preview-link`);
    return response.data;
  },
  
  getPreviewStatus: async (id) => {
    const response = await apiClient.get(`/admin/pages/${id}/preview-link`);
    return response.data;
  },

  revokePreviewLink: async (id) => {
    const response = await apiClient.delete(`/admin/pages/${id}/preview-link`);
    return response.data;
  },

  getPreviewPageData: async (token) => {
    const response = await apiClient.post(`/preview/resolve`, { token });
    return response.data;
  },
};