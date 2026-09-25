import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(
    'idpl_admin_theme'
  );

  if (savedTheme) {
    return savedTheme === 'dark';
  }

  if (typeof window !== 'undefined') {
    return window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
  }

  return false;
};

const initialState = {
  isDarkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',

  initialState,

  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },

    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
} = themeSlice.actions;

export default themeSlice.reducer;