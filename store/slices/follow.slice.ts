import { Follow } from '@/types/follow.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as followService from '../services/follow.service';

interface FollowState {
  myLeaders: Follow[];
  myWorshiper: Follow[];
  loading: boolean;
  error: string | null;
  togglingLeaderId: string | null; // Track which leader is being toggled
}

const initialState: FollowState = {
  myLeaders: [],
  myWorshiper: [],
  loading: false,
  error: null,
  togglingLeaderId: null,
};

/**
 * Fetch followed leaders
 */
export const fetchMyLeaders = createAsyncThunk(
  'follow/fetchMyLeaders',
  async (worshiperId: string, { rejectWithValue }) => {
    try {
      const res = await followService.getMyLeaders(worshiperId);
      return res.documents;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch leaders');
    }
  }
);

/**
 * Fetch worshipers for a leader
 */
export const fetchMyWorshipers = createAsyncThunk(
  'follow/fetchMyWorshipers',
  async (leaderId: string, { rejectWithValue }) => {
    try {
      const res = await followService.fetchMyWorshipers(leaderId);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch worshipers');
    }
  }
);

/**
 * Toggle follow/unfollow leader
 */
export const toggleFollow = createAsyncThunk(
  'follow/toggleFollow',
  async (
    {
      worshiperId,
      leaderId,
    }: { worshiperId: string; leaderId: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // Check if already following
      const existingFollow = await followService.checkIsFollowing(worshiperId, leaderId);
      if (existingFollow) {
        // If already following, unfollow
        await followService.unfollowLeader(existingFollow.$id);
        // Refresh myLeaders to ensure state consistency
        dispatch(fetchMyLeaders(worshiperId));
        return { action: 'unfollow', followId: existingFollow.$id };
      } else {
        // If not following, follow
        const result = await followService.followLeader(worshiperId, leaderId);
        // Refresh myLeaders to ensure state consistency
        dispatch(fetchMyLeaders(worshiperId));
        return { action: 'follow', followDoc: result };
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to toggle follow status');
    }
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
        state.error = null;
      })
      .addCase(fetchMyLeaders.fulfilled, (state, action) => {
        state.myLeaders = action.payload as unknown as Follow[];
        state.loading = false;
      })
      .addCase(fetchMyLeaders.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch leaders';
      })

      // Fetch my worshipers
      .addCase(fetchMyWorshipers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyWorshipers.fulfilled, (state, action) => {
        state.myWorshiper = action.payload as unknown as Follow[];
        state.loading = false;
      })
      .addCase(fetchMyWorshipers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch worshipers';
      })

      // Toggle follow
      .addCase(toggleFollow.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        const { leaderId } = action.meta.arg;
        state.togglingLeaderId = leaderId;
        
        // Optimistically update the UI immediately
        const isCurrentlyFollowing = state.myLeaders.some((follow) => {
          if (!follow || !follow.leader) return false;
          if (typeof follow.leader === 'string') {
            return follow.leader === leaderId;
          }
          if (typeof follow.leader === 'object') {
            const leaderObj = follow.leader as any;
            return leaderObj.$id === leaderId;
          }
          return false;
        });

        if (isCurrentlyFollowing) {
          // Optimistically remove from list (unfollow)
          state.myLeaders = state.myLeaders.filter((follow) => {
            if (!follow || !follow.leader) return true;
            if (typeof follow.leader === 'string') {
              return follow.leader !== leaderId;
            }
            if (typeof follow.leader === 'object') {
              const leaderObj = follow.leader as any;
              return leaderObj.$id !== leaderId;
            }
            return true;
          });
        } else {
          // Optimistically add to list (follow) - create a temporary follow object
          const tempFollow = {
            $id: `temp-${leaderId}-${Date.now()}`,
            $collectionId: '',
            $databaseId: '',
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            worshiper: action.meta.arg.worshiperId,
            leader: leaderId,
            createdAt: new Date().toISOString(),
          } as Follow;
          state.myLeaders.push(tempFollow);
        }
      })
      .addCase(toggleFollow.fulfilled, (state) => {
        state.loading = false;
        state.togglingLeaderId = null;
        // State will be synced by fetchMyLeaders that's dispatched after toggle
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.loading = false;
        state.togglingLeaderId = null;
        state.error = (action.payload as string) || action.error.message || 'Failed to toggle follow status';
        
        // Revert optimistic update on error by refreshing the list
        // The error handling will be done by the component
      });
  },
});

export const { resetFollows } = followSlice.actions;
export default followSlice.reducer;
