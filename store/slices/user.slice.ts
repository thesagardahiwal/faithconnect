import { UserProfile } from '@/types/user.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserProfile } from '../services/user.service';


export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string) => getUserProfile(userId)
);

interface UserState {
  profile: UserProfile | null;
}

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null } as UserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.profile = action.payload as unknown as UserProfile;
    });
  },
});

export default userSlice.reducer;
