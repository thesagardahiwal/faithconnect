import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { Query } from 'react-native-appwrite';

export const fetchExplorePosts = () =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.posts, [
    Query.equal('type', 'post'),
    Query.orderDesc('createdAt'),
  ]);

export const fetchReels = () =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.posts, [
    Query.equal('type', 'reel'),
    Query.orderDesc('createdAt'),
  ]);
