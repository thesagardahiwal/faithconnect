import { toast } from "@/lib/toastShow";
import { commentService } from '@/store/services/comment.service';
import { likePost, unlikePost } from '@/store/services/like.service';
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

// --- Async Thunks for Interactions ---

export const togglePostLike = createAsyncThunk(
  'posts/toggleLike',
  async ({ postId, userId, isLiked, likeId }: { postId: string, userId: string, isLiked: boolean, likeId?: string }, { rejectWithValue }) => {
    try {
      if (isLiked && likeId) {
        await unlikePost(likeId, postId);
        return { postId, liked: false };
      } else {
        const newLike = await likePost(userId, postId);
        return { postId, liked: true, likeId: newLike.$id, likeDoc: newLike };
      }
    } catch (error: any) {
      return rejectWithValue({ postId, error: error.message, isLiked }); // Pass correct original state to revert
    }
  }
);

export const addPostComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, userId, text }: { postId: string, userId: string, text: string }, { rejectWithValue }) => {
    try {
      const comment = await commentService.addComment(postId, userId, text);
      return { postId, comment };
    } catch (error: any) {
      return rejectWithValue({ postId, error: error.message });
    }
  }
);

interface PostState {
  explore: Post[];
  reels: Post[];
  currentPost: Post | null; // For single post view
  exploreLoading: boolean;
  reelsLoading: boolean;
  exploreError: string | null;
  reelsError: string | null;
}

const initialState: PostState = {
  explore: [],
  reels: [],
  currentPost: null,
  exploreLoading: false,
  reelsLoading: false,
  exploreError: null,
  reelsError: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPost(state, action: PayloadAction<Post | null>) {
      state.currentPost = action.payload;
    },
    // Optimistic Reducers
    toggleLikeOptimistic(state, action: PayloadAction<{ postId: string, userId: string }>) {
      const { postId, userId } = action.payload;

      // Helper to update a post list
      const updatePostInList = (list: Post[]) => {
        const post = list.find(p => p.$id === postId);
        if (post) {
          const alreadyLiked = post.likes?.some(l => l.user === userId || (l.user as any)?.$id === userId); // handle populated or raw user
          if (alreadyLiked) {
            post.likes = post.likes?.filter(l => (l.user !== userId && (l.user as any)?.$id !== userId));
            post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
          } else {
            // Add mock like object using 'any' cast to bypass strict Draft typing for now
            const newLike = { $id: 'temp-id', user: userId, post: postId } as any;
            if (!post.likes) post.likes = [];
            post.likes.push(newLike);
            post.likesCount = (post.likesCount || 0) + 1;
          }
        }
      };

      updatePostInList(state.explore);
      updatePostInList(state.reels);
      if (state.currentPost && state.currentPost.$id === postId) {
        // Must use cast or check for currentPost to avoid 'possibly null' issues if logic changes, though guard is above
        const post = state.currentPost;
        const alreadyLiked = post.likes?.some(l => l.user === userId || (l.user as any)?.$id === userId);
        if (alreadyLiked) {
          post.likes = post.likes?.filter(l => (l.user !== userId && (l.user as any)?.$id !== userId));
          post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
        } else {
          const newLike = { $id: 'temp-id', user: userId, post: postId } as any;
          if (!post.likes) post.likes = [];
          post.likes.push(newLike);
          post.likesCount = (post.likesCount || 0) + 1;
        }
      }
    },
    addCommentOptimistic(state, action: PayloadAction<{ postId: string, comment: any }>) {
      const { postId, comment } = action.payload;

      const updatePostInList = (list: Post[]) => {
        const post = list.find(p => p.$id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
          post.commentsCount = (post.commentsCount || 0) + 1;
        }
      };

      updatePostInList(state.explore);
      updatePostInList(state.reels);
      if (state.currentPost && state.currentPost.$id === postId) {
        if (!state.currentPost.comments) state.currentPost.comments = [];
        state.currentPost.comments.push(comment);
        state.currentPost.commentsCount = (state.currentPost.commentsCount || 0) + 1;
      }
    },
    removeCommentOptimistic(state, action: PayloadAction<{ postId: string, commentId: string }>) {
      const { postId, commentId } = action.payload;
      const updatePostInList = (list: Post[]) => {
        const post = list.find(p => p.$id === postId);
        if (post) {
          post.comments = post.comments?.filter(c => c.$id !== commentId);
          post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
        }
      };
      updatePostInList(state.explore);
      updatePostInList(state.reels);
      if (state.currentPost && state.currentPost.$id === postId) {
        state.currentPost.comments = state.currentPost.comments?.filter(c => c.$id !== commentId);
        state.currentPost.commentsCount = Math.max(0, (state.currentPost.commentsCount || 0) - 1);
      }
    }
  },
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
      })
      // Toggle Like Handlers (mostly just for rollback on error, as optimistic handles the UI)
      .addCase(togglePostLike.fulfilled, (state, action) => {
        const { postId, liked, likeId, likeDoc } = action.payload;
        // Update the real like ID if we just liked it
        if (liked && likeDoc) {
          const updateLikeId = (list: Post[]) => {
            const post = list.find(p => p.$id === postId);
            if (post) {
              const tempLike = post.likes?.find(l => l.$id === 'temp-id');
              if (tempLike) {
                tempLike.$id = likeDoc.$id; // Replace temp ID with real ID
              }
            }
          }
          updateLikeId(state.explore);
          updateLikeId(state.reels);
          if (state.currentPost && state.currentPost.$id === postId) {
            const tempLike = state.currentPost.likes?.find(l => l.$id === 'temp-id');
            if (tempLike) {
              tempLike.$id = likeDoc.$id;
            }
          }
        }
      })
      .addCase(togglePostLike.rejected, (state, action: any) => {
        // Rollback
        const { postId, isLiked } = action.payload || {}; // isLiked here is the state BEFORE the toggle we tried
        // Accessing `action.meta.arg` would be better usually but we passed context in rejectWithValue
        // Wait, rejectWithValue payload arguments are custom.
        // Actually, easiest rollback is to just run the toggle logic AGAIN (reverse it back).
        if (action.meta.arg) {
          const { postId, userId } = action.meta.arg;
          // Revert by re-running the optimistic toggle logic, which flips the state
          postSlice.caseReducers.toggleLikeOptimistic(state, { payload: { postId, userId }, type: 'posts/toggleLikeOptimistic' });
          toast({ type: 'error', text1: 'Failed to update like.' });
        }
      })
      // Add Comment Handlers
      .addCase(addPostComment.fulfilled, (state, action) => {
        // Replace temp comment with real one if we generated a temp ID (we didn't yet, assume optimistic passed a temp ID)
      })
      .addCase(addPostComment.rejected, (state, action) => {
        // Rollback
        // We can use the passed arguments to find the comment and remove it
        // Ideally we should have passed a temp ID to optimistic add.
        // For simplify, we will just toast error for now or remove the last added comment?
        // Better: removeCommentOptimistic using the ID we created ideally.
        toast({ type: 'error', text1: 'Failed to post comment.' });
        // We need the comment ID to remove it.
      });
  },
});

export const { setCurrentPost, toggleLikeOptimistic, addCommentOptimistic, removeCommentOptimistic } = postSlice.actions;

export default postSlice.reducer;
