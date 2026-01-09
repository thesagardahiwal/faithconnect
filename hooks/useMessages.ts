import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'react-native-appwrite';

export const useMessages = () => {
  const sendMessage = async (
    chatId: string,
    senderId: string,
    text: string
  ) => {
    return databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.messages,
      ID.unique(),
      {
        chat: chatId,
        sender: senderId,
        text,
        createdAt: new Date().toISOString(),
      }
    );
  };

  const fetchMessages = async (chatId: string) => {
    return databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.messages,
      [
        Query.equal('chat', chatId),
        Query.orderAsc('createdAt'),
      ]
    );
  };

  return {
    sendMessage,
    fetchMessages,
  };
};
