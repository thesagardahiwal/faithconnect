import { APPWRITE_CONFIG } from '@/config/appwrite';
import { client, databases } from '@/lib/appwrite';
import { getItem } from '@/lib/manageStorage';
import { PROFILE_KEY } from '@/store/slices/user.slice';
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

// Used to keep a global persistent user ID if `userId` prop is absent
let globalActualUserId: string | null = null;

export const useChat = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  // ✅ FIX 1: initial value provided
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Check and set the global actualUserId if userId is missing
  useEffect(() => {
    const checkAndSetUserId = async () => {
      if (!userId && !globalActualUserId) {
        const profile = await getItem(PROFILE_KEY);
        if (profile && profile.$id) {
          globalActualUserId = profile.$id;
        }
      }
    };
    checkAndSetUserId();
  }, [userId]);

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
    // Determine sender ID
    let actualUserId = userId;
    if (!userId) {
      // If globalActualUserId isn't loaded yet, load it now
      if (!globalActualUserId) {
        const profile = await getItem(PROFILE_KEY);
        if (profile && profile.$id) {
          globalActualUserId = profile.$id;
        } else {
          Alert.alert('User not found', 'Please log in again or refresh!');
          return;
        }
      }
      actualUserId = globalActualUserId!;
    } else {
      // If userId is present, ensure global is up-to-date for future uses
      globalActualUserId = userId;
    }
    if (!chatId) {
      Alert.alert('Chat not found', 'This conversation could not be found or loaded.');
      return;
    }

    setSending(true);

    await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.messages,
      ID.unique(),
      {
        chat: chatId,
        sender: actualUserId,
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
