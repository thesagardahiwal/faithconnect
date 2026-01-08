import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { Query } from 'react-native-appwrite';

export const fetchNotifications = (userId: string) =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.notifications, [
    Query.equal('user', userId),
    Query.orderDesc('createdAt'),
  ]);
