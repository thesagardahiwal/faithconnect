import { removeItem, setItem } from '@/lib/manageStorage';
import { UserProfile } from '@/types/user.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile } from '../services/user.service';

const PROFILE_KEY = 'user_profile';

async function storeProfile(profile: UserProfile) {
  try {
    await setItem(PROFILE_KEY, profile);
  } catch {
    // Fail silently; not critical for UX
  }
}

async function clearStoredProfile() {
  try {
    await removeItem(PROFILE_KEY);
  } catch {
    // Ignore
  }
}

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getUserProfile(userId);
      // response.documents is expected to be an array of user profiles
      const profile = response.documents[0] ?? null;
      if (profile) {
        await storeProfile(profile as unknown as UserProfile);
      } else {
        await clearStoredProfile();
      }
      return profile;
    } catch (error) {
      await clearStoredProfile();
      return rejectWithValue(
        (error as Error)?.message || 'Failed to fetch user profile'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    { profileId, data }: { profileId: string; data: Partial<UserProfile> },
    { rejectWithValue }
  ) => {
    try {
      const updated = await updateUserProfile(profileId, data);
      const profile = updated as unknown as UserProfile;
      await storeProfile(profile);
      return profile;
    } catch (error) {
      return rejectWithValue(
        (error as Error)?.message || 'Failed to update profile'
      );
    }
  }
);

interface UserState {
  profile: UserProfile | null;
}

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null } as UserState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      clearStoredProfile();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload as unknown as UserProfile;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.profile = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
