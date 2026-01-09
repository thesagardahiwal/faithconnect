import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/user.types';
import * as userService from '../services/user.service';
import * as postService from '../services/post.service';
import { Post } from '@/types/post.types';

interface LeaderState {
  leaders: UserProfile[];
  currentLeader: UserProfile | null;
  leaderPosts: Post[];
  leaderReels: Post[];
  loading: boolean;
  loadingProfile: boolean;
  loadingPosts: boolean;
  error: string | null;
}

const initialState: LeaderState = {
  leaders: [],
  currentLeader: null,
  leaderPosts: [],
  leaderReels: [],
  loading: false,
  loadingProfile: false,
  loadingPosts: false,
  error: null,
};

/**
 * Fetch all leaders
 */
export const fetchAllLeaders = createAsyncThunk(
  'leader/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getAllLeaders();
      return res.documents;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch leaders');
    }
  }
);

/**
 * Fetch leader profile by ID
 */
export const fetchLeaderProfile = createAsyncThunk(
  'leader/fetchProfile',
  async (leaderId: string, { rejectWithValue }) => {
    try {
      const profile = await userService.getLeaderProfile(leaderId);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch leader profile');
    }
  }
);

/**
 * Fetch posts by leader ID
 */
export const fetchLeaderPosts = createAsyncThunk(
  'leader/fetchPosts',
  async (leaderId: string, { rejectWithValue }) => {
    try {
      const res = await postService.fetchPostsByLeader(leaderId);
      return res.documents;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch leader posts');
    }
  }
);

/**
 * Fetch reels by leader ID
 */
export const fetchLeaderReels = createAsyncThunk(
  'leader/fetchReels',
  async (leaderId: string, { rejectWithValue }) => {
    try {
      const res = await postService.fetchReelsByLeader(leaderId);
      return res.documents;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch leader reels');
    }
  }
);

const leaderSlice = createSlice({
  name: 'leader',
  initialState,
  reducers: {
    clearCurrentLeader: (state) => {
      state.currentLeader = null;
      state.leaderPosts = [];
      state.leaderReels = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leaders
      .addCase(fetchAllLeaders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaders.fulfilled, (state, action) => {
        state.leaders = action.payload as unknown as UserProfile[];
        state.loading = false;
      })
      .addCase(fetchAllLeaders.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch leaders';
      })
      // Fetch leader profile
      .addCase(fetchLeaderProfile.pending, (state) => {
        state.loadingProfile = true;
        state.error = null;
      })
      .addCase(fetchLeaderProfile.fulfilled, (state, action) => {
        state.currentLeader = action.payload as unknown as UserProfile;
        state.loadingProfile = false;
      })
      .addCase(fetchLeaderProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error = (action.payload as string) || 'Failed to fetch leader profile';
      })
      // Fetch leader posts
      .addCase(fetchLeaderPosts.pending, (state) => {
        state.loadingPosts = true;
        state.error = null;
      })
      .addCase(fetchLeaderPosts.fulfilled, (state, action) => {
        state.leaderPosts = action.payload as unknown as Post[];
        state.loadingPosts = false;
      })
      .addCase(fetchLeaderPosts.rejected, (state, action) => {
        state.loadingPosts = false;
        state.error = (action.payload as string) || 'Failed to fetch leader posts';
      })
      // Fetch leader reels
      .addCase(fetchLeaderReels.fulfilled, (state, action) => {
        state.leaderReels = action.payload as unknown as Post[];
      });
  },
});

export const { clearCurrentLeader } = leaderSlice.actions;
export default leaderSlice.reducer;
