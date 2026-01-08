import { databases } from '@/lib/appwrite';
import { Query } from 'react-native-appwrite';

export const fetchChats = (userId: string) =>
  databases.listDocuments('db', 'chats', [
    Query.or([
      Query.equal('worshiper', userId),
      Query.equal('leader', userId),
    ]),
  ]);
