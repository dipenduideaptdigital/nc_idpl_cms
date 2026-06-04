import apiClient from './client';

export const contactsApi = {
  submitContactForm: async (payload) => {
    const response = await apiClient.post('/contacts/submit', payload);
    return response.data;
  }
};