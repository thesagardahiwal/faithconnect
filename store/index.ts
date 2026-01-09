import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/auth.slice';
import chatReducer from './slices/chat.slice';
import followReducer from './slices/follow.slice';
import leaderReducer from './slices/leader.slice';
import notificationReducer from './slices/notification.slice';
import postReducer from './slices/post.slice';
import userReducer from './slices/user.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    follows: followReducer,
    chats: chatReducer,
    notifications: notificationReducer,
    leaders: leaderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
