export default ({ config }) => ({
    ...config,
    extra: {
      ...config.extra,
      router: {},
      eas: {
        projectId: "a0f7d5e2-8eb9-496d-8036-2191cb086479"
      },
  
      // 🔥 ENV VARIABLES
      appwrite: {
        projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
        projectName: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME,
        endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID
      }
    }
  });
  