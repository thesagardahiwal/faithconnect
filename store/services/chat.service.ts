import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'react-native-appwrite';

export const fetchChats = (userId: string) =>
  databases.listDocuments(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collections.chats, 
    [
      Query.or([
        Query.equal('worshiper', userId),
        Query.equal('leader', userId),
    ]),
    Query.select([
      "*",
      'leader.*',
      'worshiper.*'
    ])
  ]);
/**
 * Check if chat exists between worshiper & leader
 */
export const findChatBetweenUsers = async (
  worshiperId: string,
  leaderId: string
) => {
  const res = await databases.listDocuments(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collections.chats,
    [
      Query.equal('worshiper', worshiperId),
      Query.equal('leader', leaderId),
      Query.limit(1),
    ]
  );

  return res.documents[0] ?? null;
};

/**
 * Create new chat
 */
export const createChat = async (
  worshiperId: string,
  leaderId: string
) => {
  return databases.createDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collections.chats,
    ID.unique(),
    {
      worshiper: worshiperId,
      leader: leaderId,
    }
  );
};
