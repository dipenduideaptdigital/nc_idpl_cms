import { createAsyncThunk } from '@reduxjs/toolkit';

import apiClient from '../../api/client';
import { logout } from './authSlice';

export const verifySession = createAsyncThunk(
  'auth/verifySession',

  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return null;
    }

    try {
      const res = await apiClient.get('/auth/me');

      if (!res.data?.success) {
        localStorage.removeItem('accessToken');

        return rejectWithValue(
          'Session verification failed'
        );
      }

      const user = {
        ...res.data.data,
        permissions: res.data.data.permissions || [],
      };

      return user;
    } catch (error) {
      localStorage.removeItem('accessToken');

      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Session verification failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',

  async (_, { dispatch }) => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error(
        'Logout API failed, forcing local logout',
        error
      );
    } finally {
      localStorage.removeItem('accessToken');

      dispatch(logout());
    }
  }
);