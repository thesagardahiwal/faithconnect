import { Chat } from '@/types/chat.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChats } from '../services/chat.service';

export const loadChats = createAsyncThunk(
  'chats/load',
  fetchChats
);

interface ChatState {
  list: Chat[];
  loading: boolean;
}

const chatSlice = createSlice({
  name: 'chats',
  initialState: { list: [], loading: false } as ChatState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadChats.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(loadChats.fulfilled, (state, action) => {
      state.list = action.payload.documents as unknown as Chat[];
      state.loading = false;
    })
    builder.addCase(loadChats.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default chatSlice.reducer;
