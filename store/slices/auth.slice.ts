import { removeItem, setItem } from '@/lib/manageStorage';
import { toast } from "@/lib/toastShow";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Models } from 'react-native-appwrite';
import * as authService from '../services/auth.service';

const USER_KEY = 'user_info';
const PROFILE_KEY = 'user_profile';

async function storeUser(user: Models.User<Models.Preferences>) {
  try {
    await setItem(USER_KEY, user);
  } catch {
    // Fail silently; not critical for UX
  }
}

async function clearStoredUser() {
  try {
    await removeItem(USER_KEY);
  } catch {
    // Ignore
  }
}

async function clearStoredProfile() {
  try {
    await removeItem(PROFILE_KEY);
  } catch {
    // Ignore
  }
}

export const fetchSession = createAsyncThunk(
  'auth/fetchSession',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      await storeUser(user);
      return user;
    } catch (error: any) {
      await clearStoredUser();
      return rejectWithValue(error?.message || 'Failed to fetch session');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('Login thunk started');
      console.log('Attempting login for email:', email);
      await authService.login(email, password);
      console.log('Login successful, fetching current user');
      const user = await authService.getCurrentUser();
      console.log('Fetched user after login:', user);
      await storeUser(user);
      return user;
    } catch (error: any) {
      await clearStoredUser();
      console.log('Error during login:', error);
      return rejectWithValue(error?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('Register thunk started');
      console.log('Registering user with email:', email);
      await authService.register(email, password);
      console.log('User registered, now fetching user info');
      const user = await authService.getCurrentUser();
      console.log('Fetched user after registration:', user);
      await storeUser(user);
      return user;
    } catch (error: any) {
      await clearStoredUser();
      console.log('Error during registration:', error);
      return rejectWithValue(error?.message || 'Registration failed');
    }
  }
);

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      clearStoredUser();
      clearStoredProfile();
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
      .addCase(fetchSession.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        toast({
          type: "error",
          text1: "Session Load Failed",
          text2:
            (typeof action.payload === 'string'
              ? action.payload
              : 'Could not restore user session, please login again.') as string,
        });
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload as unknown as Models.User<Models.Preferences>;
        toast({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back! You're signed in.",
        });
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        toast({
          type: "error",
          text1: "Login Failed",
          text2:
            (typeof action.payload === 'string'
              ? action.payload
              : action.error?.message ||
                "Invalid email or password. Please try again.") as string,
        });
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload as unknown as Models.User<Models.Preferences>;
        toast({
          type: "success",
          text1: "Registration Successful!",
          text2: "Welcome to FaithConnect! Your account has been created.",
        });
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        toast({
          type: "error",
          text1: "Registration Failed",
          text2:
            (typeof action.payload === 'string'
              ? action.payload
              : action.error?.message ||
                "Unable to create account. Please check your info and try again.") as string,
        });
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
