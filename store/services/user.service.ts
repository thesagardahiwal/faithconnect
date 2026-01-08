import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';

export const getUserProfile = (userId: string) =>
  databases.getDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.users, userId);
