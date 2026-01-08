import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as followService from '../services/follow.service';

interface FollowState {
  myLeaders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FollowState = {
  myLeaders: [],
  loading: false,
  error: null,
};

/**
 * Fetch followed leaders
 */
export const fetchMyLeaders = createAsyncThunk(
  'follow/fetchMyLeaders',
  async (worshiperId: string) => {
    const res = await followService.getMyLeaders(worshiperId);
    return res.documents;
  }
);

/**
 * Follow leader
 */
export const followLeader = createAsyncThunk(
  'follow/followLeader',
  async (
    {
      worshiperId,
      leaderId,
    }: { worshiperId: string; leaderId: string }
  ) => {
    return followService.followLeader(worshiperId, leaderId);
  }
);

/**
 * Unfollow leader
 */
export const unfollowLeader = createAsyncThunk(
  'follow/unfollowLeader',
  async (followId: string) => {
    await followService.unfollowLeader(followId);
    return followId;
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    resetFollows: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch my leaders
      .addCase(fetchMyLeaders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyLeaders.fulfilled, (state, action) => {
        state.myLeaders = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyLeaders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leaders';
      })

      // Follow
      .addCase(followLeader.fulfilled, (state, action) => {
        state.myLeaders.push(action.payload);
      })

      // Unfollow
      .addCase(unfollowLeader.fulfilled, (state, action) => {
        state.myLeaders = state.myLeaders.filter(
          (f) => f.$id !== action.payload
        );
      });
  },
});

export const { resetFollows } = followSlice.actions;
export default followSlice.reducer;
