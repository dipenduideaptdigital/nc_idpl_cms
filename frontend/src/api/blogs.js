import apiClient from './client';

export const blogsApi = {
  getPublicBlogs: async (params = {}) => {
    const response = await apiClient.get('/blogs', { params });
    return response.data;
  },

  getPublicBlogBySlug: async (slug) => {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data;
  },

  getPublicCategories: async () => {
    const response = await apiClient.get('/blogs/categories');
    return response.data;
  },

  getPublicTags: async () => {
    const response = await apiClient.get('/blogs/tags');
    return response.data;
  },

  resolvePublicBlogPreview: async (token) => {
    const response = await apiClient.post(`/blogs/preview/resolve`, { token });
    return response.data;
  },

  getAdminBlogs: async (params = {}) => {
    const response = await apiClient.get('/admin/blogs', { params });
    return response.data;
  },

  createBlogPost: async (payload) => {
    const response = await apiClient.post('/admin/blogs', payload);
    return response.data;
  },

  updateBlogPost: async (id, payload) => {
    const response = await apiClient.patch(`/admin/blogs/${id}`, payload);
    return response.data;
  },

  deleteBlogPost: async (id) => {
    const response = await apiClient.delete(`/admin/blogs/${id}`);
    return response.data;
  },

  generatePreviewLink: async (id) => {
    const response = await apiClient.post(`/admin/blogs/${id}/preview-link`);
    return response.data;
  },

  getPreviewStatus: async (id) => {
    const response = await apiClient.get(`/admin/blogs/${id}/preview-link`);
    return response.data;
  },

  revokePreviewLink: async (id) => {
    const response = await apiClient.delete(`/admin/blogs/${id}/preview-link`);
    return response.data;
  },

  createCategory: async (payload) => {
    const response = await apiClient.post('/admin/blogs/categories', payload);
    return response.data;
  },

  updateCategory: async (id, payload) => {
    const response = await apiClient.patch(`/admin/blogs/categories/${id}`, payload);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/admin/blogs/categories/${id}`);
    return response.data;
  },

  createTag: async (payload) => {
    const response = await apiClient.post('/admin/blogs/tags', payload);
    return response.data;
  },

  updateTag: async (id, payload) => {
    const response = await apiClient.patch(`/admin/blogs/tags/${id}`, payload);
    return response.data;
  },

  deleteTag: async (id) => {
    const response = await apiClient.delete(`/admin/blogs/tags/${id}`);
    return response.data;
  }
};