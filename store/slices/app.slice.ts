import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    initialized: false,
  },
  reducers: {
    setInitialized(state) {
      state.initialized = true;
    },
    resetApp() {
      return { initialized: false };
    },
  },
});

export const { setInitialized, resetApp } = appSlice.actions;
export default appSlice.reducer;
