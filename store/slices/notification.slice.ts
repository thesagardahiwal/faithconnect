import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchNotifications } from '../services/notification.service';

export const loadNotifications = createAsyncThunk(
  'notifications/load',
  fetchNotifications
);

interface NotificationState {
  list: Notification[];
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [] } as NotificationState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadNotifications.fulfilled, (state, action) => {
      state.list = action.payload.documents as unknown as Notification[];
    });
  },
});

export default notificationSlice.reducer;
