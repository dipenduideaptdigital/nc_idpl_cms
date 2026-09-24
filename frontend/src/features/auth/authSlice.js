import { createSlice } from '@reduxjs/toolkit';
import { verifySession } from './authThunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(verifySession.pending, (state) => {
        state.isInitializing = true;
      })

      .addCase(verifySession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }

        state.isInitializing = false;
      })

      .addCase(verifySession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;