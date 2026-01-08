import { Post } from '@/types/post.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as postService from '../services/post.service';

export const loadExploreFeed = createAsyncThunk(
  'posts/explore',
  postService.fetchExplorePosts
);

interface PostState {
  explore: Post[];
  reels: Post[];
}

const postSlice = createSlice({
  name: 'posts',
  initialState: { explore: [], reels: [] } as PostState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadExploreFeed.fulfilled, (state, action) => {
      state.explore = action.payload.documents as unknown as Post[];
    });
  },
});

export default postSlice.reducer;
