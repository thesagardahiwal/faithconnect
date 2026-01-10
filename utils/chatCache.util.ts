import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_CACHE_KEY = 'faithconnect_chat_cache';

/**
 * Cache structure:
 * {
 *   "worshiperId_leaderId": "chatId"
 * }
 */

type ChatCacheMap = Record<string, string>;

const makeKey = (userId: string, leaderId: string) =>
  `${userId}_${leaderId}`;

export const getCachedChatId = async (
  userId: string,
  leaderId: string
): Promise<string | null> => {
  const raw = await AsyncStorage.getItem(CHAT_CACHE_KEY);
  if (!raw) return null;

  const cache: ChatCacheMap = JSON.parse(raw);
  return cache[makeKey(userId, leaderId)] ?? null;
};

export const cacheChatId = async (
  userId: string,
  leaderId: string,
  chatId: string
) => {
  const raw = await AsyncStorage.getItem(CHAT_CACHE_KEY);
  const cache: ChatCacheMap = raw ? JSON.parse(raw) : {};

  cache[makeKey(userId, leaderId)] = chatId;

  await AsyncStorage.setItem(
    CHAT_CACHE_KEY,
    JSON.stringify(cache)
  );
};
