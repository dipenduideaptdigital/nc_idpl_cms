import apiClient from './client';

export const dashboardApi = {
  getMetrics: async () => {
    const response = await apiClient.get('/admin/dashboard/metrics');
    return response.data;
  },

  getChartTimeline: async (range = '30D') => {
    const response = await apiClient.get('/admin/dashboard/chart', { params: { range } });
    return response.data;
  },

  getActivityStream: async () => {
    const response = await apiClient.get('/admin/dashboard/activity');
    return response.data;
  },

  exportLeadsCSV: async () => {
    const response = await apiClient.get('/admin/dashboard/export-leads', {
      responseType: 'blob' 
    });
    return response.data;
  },

  getLiveVisitors: async () => {
    const response = await apiClient.get('/admin/dashboard/live-visitors');
    return response.data;
  }
};