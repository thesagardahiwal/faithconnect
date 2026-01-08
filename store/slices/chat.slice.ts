import { Chat } from '@/types/chat.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChats } from '../services/chat.service';

export const loadChats = createAsyncThunk(
  'chats/load',
  fetchChats
);

interface ChatState {
  list: Chat[];
}

const chatSlice = createSlice({
  name: 'chats',
  initialState: { list: [] } as ChatState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadChats.fulfilled, (state, action) => {
      state.list = action.payload.documents as unknown as Chat[];
    });
  },
});

export default chatSlice.reducer;
