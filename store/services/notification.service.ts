import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases, } from '@/lib/appwrite';
import { ID, Query } from 'react-native-appwrite';

export const notificationService = {
  async create(data: {
    to: string;
    from?: string;
    type: 'like' | 'comment' | 'follow' | 'message';
    post?: string;
    chat?: string;
    text?: string;
  }) {
    return databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.notifications,
      ID.unique(),
      {
        ...data,
        read: false,
      }
    );
  },

  async fetch(userId: string) {
    return databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.notifications,
      [
        Query.equal('to', userId),
        Query.orderDesc('$createdAt'),
      ]
    );
  },

  async markAsRead(id: string) {
    console.log('[NotificationService] markAsRead ID:', id, typeof id);
    try {
      const result = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.notifications,
        id,
        { read: true }
      );
      console.log('[NotificationService] markAsRead success', result);
      return result;
    } catch (error) {
      console.error('[NotificationService] markAsRead failed', error);
      throw error;
    }
  },
};
