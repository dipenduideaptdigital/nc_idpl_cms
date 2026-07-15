import apiClient from './client';

export const projectsApi = {
  getAdminProjects: async (params = {}) => {
    const response = await apiClient.get('/admin/projects', { params });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await apiClient.get(`/admin/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await apiClient.post('/admin/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await apiClient.patch(`/admin/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await apiClient.delete(`/admin/projects/${id}`);
    return response.data;
  },

  getPublicProjects: async (params = {}) => {
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },

  getPublicProjectBySlug: async (slug) => {
    const response = await apiClient.get(`/projects/${slug}`);
    return response.data;
  }
};