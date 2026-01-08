export const APPWRITE_CONFIG = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: 'YOUR_PROJECT_ID',
  
    databaseId: 'faithconnect_db',
  
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
      profilePhotos: 'profile_photos',
      postMedia: 'post_media',
      reelsMedia: 'reels_media',
    },
  };
  