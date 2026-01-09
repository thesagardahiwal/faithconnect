import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { UserProfile } from '@/types/user.types';
import { ID, Query } from 'react-native-appwrite';

export const getUserProfile = (userId: string) =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.users, [
    Query.equal('userId', userId)
  ]);

export const createUserProfile = (userId: string, data: Partial<UserProfile>) => 
  databases.createDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.users, ID.unique(), data);

/**
 * Fetch all leaders (users with role='leader')
 */
export const getAllLeaders = () =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.users, [
    Query.equal('role', 'leader'),
    Query.orderDesc('$createdAt'),
  ]);

/**
 * Fetch a leader profile by profile ID
 */
export const getLeaderProfile = (profileId: string) =>
  databases.getDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.users, profileId);

/**
 * Update user profile
 */
export const updateUserProfile = (profileId: string, data: Partial<UserProfile>) =>
  databases.updateDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.users, profileId, data);
