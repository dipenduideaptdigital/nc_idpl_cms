import apiClient from './client';

export const mediaApi = {
  getAllMedia: async (params = {}) => {
    const response = await apiClient.get('/uploads', { params });
    return response.data;
  },
  getMediaById: async (id) => {
    const response = await apiClient.get(`/uploads/${id}`);
    return response.data;
  },
  uploadImage: async (formData) => {
    const response = await apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  uploadMultipleImages: async (formData) => {
    const response = await apiClient.post('/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteMedia: async (id) => {
    const response = await apiClient.delete(`/uploads/${id}`);
    return response.data;
  }
};