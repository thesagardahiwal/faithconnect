import { BUCKET_ID, DATABASE_ID, ENDPOINT, PROJECT_ID } from "@/constants/env";

export const APPWRITE_CONFIG = {
    endpoint: ENDPOINT,
    projectId: PROJECT_ID,
  
    databaseId: DATABASE_ID,
  
    collections: {
      users: 'users_profile',
      posts: 'posts',
      follows: 'follows',
      likes: 'likes',
      chats: 'chats',
      messages: 'messages',
      notifications: 'notifications',
    },
  
    buckets: {
      profilePhotos: BUCKET_ID,
      postMedia: BUCKET_ID,
      reelsMedia: BUCKET_ID,
    },
  };
  