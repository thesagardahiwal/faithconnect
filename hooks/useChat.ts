import { APPWRITE_CONFIG } from '@/config/appwrite';
import { client, databases } from '@/lib/appwrite';
import { getItem } from '@/lib/manageStorage';
import { notificationService } from '@/store/services/notification.service';
import { PROFILE_KEY } from '@/store/slices/user.slice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ID, Query } from 'react-native-appwrite';

interface Message {
  $id: string;
  chat: string;
  sender: string;
  text: string;
  $createdAt: string;
}

// Persistent global fallback for user ID
let globalActualUserId: string | null = null;

export const useChat = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  // Keep latest unsubscribe around in ref
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Always make sure we have a userId loaded in global, if not present
  useEffect(() => {
    if (!userId && !globalActualUserId) {
      (async () => {
        const profile = await getItem(PROFILE_KEY);
        if (profile && profile.$id) {
          globalActualUserId = profile.$id;
        }
      })();
    }
  }, [userId]);

  // Fetch the messages of a chat thread
  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.messages,
        [
          Query.equal('chat', chatId),
          Query.orderAsc('$createdAt'),
        ]
      );
      setMessages(res.documents as unknown as Message[]);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setSocketError('Failed to load messages.');
      Alert.alert('Connection Error', 'Could not load messages. Please check your connection.');
    }
  }, [chatId]);

  // Send a message to the current chat, auto-detect actualUserId if missing
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // 1. Find the correct sender ID
      let actualUserId = userId;
      if (!userId) {
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
        globalActualUserId = userId;
      }

      // 2. Validate chatId
      if (!chatId) {
        Alert.alert('Chat not found', 'This conversation could not be found or loaded.');
        return;
      }

      setSending(true);

      try {
        // 3. Actually send the message
        const newMsg = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.messages,
          ID.unique(),
          {
            chat: chatId,
            sender: actualUserId,
            text,
          }
        );

        // 4. Update the chat's lastMessage and lastMessageAt
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.chats,
          chatId,
          {
            lastMessage: newMsg.$id,
            lastMessageAt: newMsg.$createdAt
          }
        );

        // 5. Notification
        // We need to know who to send it to.
        // We can fetch the chat to find out, or ideally we already have it.
        // For efficiency, we should have fetched the chat earlier.
        // But to keep it simple and robust, let's fetch the chat here if we don't have stored receiver.
        // Or better: Fetch chat on mount and store receiverId.

        // Fetch chat logic inline for now to ensure correctness
        const chatDoc = await databases.getDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.chats,
          chatId
        );

        let receiverId = '';
        const w = (chatDoc.worshiper as any)?.$id || chatDoc.worshiper;
        const l = (chatDoc.leader as any)?.$id || chatDoc.leader;

        if (w === actualUserId) receiverId = l;
        else if (l === actualUserId) receiverId = w;

        if (receiverId) {
          await notificationService.create({
            to: receiverId,
            from: actualUserId,
            type: 'message',
            chat: chatId,
            text: 'sent you a message',
          });
        }

      } catch (error) {
        console.error("Failed to send message:", error);
        Alert.alert('Error', 'Failed to send message. Please try again.');
      } finally {
        setSending(false);
      }
    },
    [chatId, userId]
  );

  // Websocket subscription effect - clean up on unmount, robustly handle error
  useEffect(() => {
    if (!chatId) return;

    const channel = `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.messages}.documents`;
    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = client.subscribe(channel, (response) => {
        // Only reload if a new message got created for *this* chat
        const { events, payload } = response;
        if (!events.some((e) => e.endsWith('.create'))) return;
        if (payload) {
          loadMessages();
        }
      });

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error('Websocket subscription failed:', err);
      setSocketError('Failed to connect to server in real time. Try again later.');
      Alert.alert('Connection Error', 'Could not subscribe to messages. Please check your network.');
      unsubscribeRef.current = null;
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          // Defensive: ignore errors thrown when unsubscribing after socket issues
          console.warn('Websocket unsubscribe error:', err);
        }
        unsubscribeRef.current = null;
      }
    };
  }, [chatId, loadMessages]);

  return {
    messages,
    sendMessage,
    sending,
    loadMessages,
    socketError,
  };
};
