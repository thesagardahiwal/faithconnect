import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Models } from 'react-native-appwrite';
import * as authService from '../services/auth.service';

export const fetchSession = createAsyncThunk(
  'auth/fetchSession',
  async () => authService.getCurrentUser()
);

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false } as AuthState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.user = action.payload as unknown as Models.User<Models.Preferences>;
        state.loading = false;
      })
      .addCase(fetchSession.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
