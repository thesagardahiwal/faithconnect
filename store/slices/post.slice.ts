import { toast } from "@/lib/toastShow";
import { Post } from '@/types/post.types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as postService from '../services/post.service';
export const loadExploreFeed = createAsyncThunk<
  { documents: Post[] }, // Return type of thunk
  void,                  // Input argument to thunk
  { rejectValue: string }
>(
  'posts/explore',
  async (_, { rejectWithValue }) => {
    console.log('[loadExploreFeed] Start fetching explore posts');
    try {
      const response = await postService.fetchExplorePosts();
      console.log('[loadExploreFeed] fetchExplorePosts response:', response);
      // Assume response.documents is the array of posts
      return { documents: response.documents as unknown as Post[] };
    } catch (err: any) {
      console.error('[loadExploreFeed] Error fetching explore feed:', err);
      // Add more robust error message extraction if needed
      return rejectWithValue(
        err?.message || 'Failed to fetch explore feed.'
      );
    }
  }
);

export const loadReelsFeed = createAsyncThunk<
  { documents: Post[] }, // Return type of thunk
  void,                  // Input argument to thunk
  { rejectValue: string }
>(
  'posts/reels',
  async (_, { rejectWithValue }) => {
    console.log('[loadReelsFeed] Start fetching reels');
    try {
      const response = await postService.fetchReels();
      console.log('[loadReelsFeed] fetchReels response:', response);
      // Assume response.documents is the array of reels
      return { documents: response.documents as unknown as Post[] };
    } catch (err: any) {
      console.error('[loadReelsFeed] Error fetching reels:', err);
      return rejectWithValue(
        err?.message || 'Failed to fetch reels.'
      );
    }
  }
);

interface PostState {
  explore: Post[];
  reels: Post[];
  exploreLoading: boolean;
  reelsLoading: boolean;
  exploreError: string | null;
  reelsError: string | null;
}

const initialState: PostState = {
  explore: [],
  reels: [],
  exploreLoading: false,
  reelsLoading: false,
  exploreError: null,
  reelsError: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Explore feed
      .addCase(loadExploreFeed.pending, (state) => {
        state.exploreLoading = true;
        state.exploreError = null;
      })
      .addCase(loadExploreFeed.fulfilled, (state, action: PayloadAction<{ documents: Post[] }>) => {
        state.explore = action.payload.documents;
        state.exploreLoading = false;
        state.exploreError = null;
      })
      .addCase(loadExploreFeed.rejected, (state, action) => {
        state.exploreLoading = false;
        state.exploreError = action.payload || action.error.message || 'Failed to load explore feed.';
        toast({ type: 'error', text1: state.exploreError! });
      })
      // Reels feed
      .addCase(loadReelsFeed.pending, (state) => {
        state.reelsLoading = true;
        state.reelsError = null;
      })
      .addCase(loadReelsFeed.fulfilled, (state, action: PayloadAction<{ documents: Post[] }>) => {
        state.reels = action.payload.documents;
        state.reelsLoading = false;
        state.reelsError = null;
      })
      .addCase(loadReelsFeed.rejected, (state, action) => {
        state.reelsLoading = false;
        state.reelsError = action.payload || action.error.message || 'Failed to load reels.';
        toast({ type: 'error', text1: state.reelsError! });
      });
  },
});

export default postSlice.reducer;
