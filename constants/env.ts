import Constants from 'expo-constants';

const appwriteConfig = Constants.expoConfig?.extra?.appwrite;

export const PROJECT_ID = appwriteConfig?.projectId || '';
export const DATABASE_ID = appwriteConfig?.databaseId || '';
export const ENDPOINT = appwriteConfig?.endpoint || '';
export const BUCKET_ID = appwriteConfig?.bucketId || '';