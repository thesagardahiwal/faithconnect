import { APPWRITE_CONFIG } from '@/config/appwrite';
import { client, databases } from '@/lib/appwrite';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ID, Query } from 'react-native-appwrite';

interface Message {
  $id: string;
  chat: string;
  sender: string;
  text: string;
  $createdAt: string;
}

export const useChat = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  // ✅ FIX 1: initial value provided
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const loadMessages = async () => {
    const res = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.messages,
      [
        Query.equal('chat', chatId),
        Query.orderAsc('$createdAt'),
      ]
    );

    setMessages(res.documents as unknown as Message[]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (!chatId || !userId) {
      Alert.alert('ChatId/UserId not found!', 'Please refresh!');
      return;
    }

    setSending(true);

    await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.messages,
      ID.unique(),
      {
        chat: chatId,
        sender: userId,
        text,
      }
    );

    setSending(false);
  };

  useEffect(() => {
    if (!chatId) return;

    const channel = `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.messages}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      const { events } = response;
      // Only CREATE events
      if (!events.some((e) => e.endsWith('.create'))) return;

      loadMessages();
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
    };
  }, [chatId]);

  return {
    messages,
    sendMessage,
    sending,
    loadMessages,
  };
};
