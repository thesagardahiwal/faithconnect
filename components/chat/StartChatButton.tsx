import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, useColorScheme } from 'react-native';

import { createChat, findChatBetweenUsers } from '@/store/services/chat.service';
import { cacheChatId, getCachedChatId } from '@/utils/chatCache.util';

interface StartChatButtonProps {
  worshiperId: string;
  leaderId: string;

  /** If true → icon only (leader card)
   *  If false → icon + text (leader profile)
   */
  compact?: boolean;
  isMeLeader: boolean;
}

export default function StartChatButton({
  worshiperId,
  leaderId,
  isMeLeader,
  compact = false,
}: StartChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  // Get color according to theme and FaithConnect tailwind rules
  // text-primary in tailwind: '#2667c9' (light), '#2667c9' (dark)
  // text-text-primary: '#101828' (light), '#e5e7eb' (dark)
  // For chat, primary blue is most relevant, but you may want text-text-primary for non-accent
  // We'll use text-primary: text-[#2667c9] in both light/dark according to tailwind.config.js

  const getTextColor = () => {
    return colorScheme === 'dark'
      ? 'text-primary dark:text-primary'
      : 'text-primary';
  };

  const getIconColor = () => {
    // text-primary: '#2667c9' in both light/dark
    return '#2667c9';
  };

  const handlePress = async () => {
    if (!worshiperId || !leaderId) return;

    setLoading(true);

    try {
      // 1️⃣ Check cache
      const cachedChatId = await getCachedChatId(
        worshiperId,
        leaderId
      );

      if (cachedChatId) {
        router.push({
            pathname: isMeLeader ? "/(leader)/chats/[chatId]" : "/(worshiper)/chats/[chatId]",
            params: {chatId: cachedChatId, profileId: worshiperId}
        });
        return;
      }

      // 2️⃣ Check backend
      const existingChat = await findChatBetweenUsers(
        worshiperId,
        leaderId
      );

      if (existingChat) {
        await cacheChatId(
          worshiperId,
          leaderId,
          existingChat.$id
        );
        router.push(`/${isMeLeader ? "(leader)" : "(worshiper)"}/chats/${existingChat.$id}`);
        return;
      }

      // 3️⃣ Create chat
      const newChat = await createChat(
        worshiperId,
        leaderId
      );

      await cacheChatId(
        worshiperId,
        leaderId,
        newChat.$id
      );

      router.push(`/${isMeLeader ? "(leader)" : "(worshiper)"}/chats/${newChat.$id}`);
    } finally {
      setLoading(false);
    }
  };

  if (leaderId === worshiperId) return null;
  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      className={`flex-row rounded-full items-center ${
        compact ? 'px-4' : 'mt-4 px-6 py-3 rounded-full border border-primary'
      }`}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={getIconColor()} />
      )}

      {!compact && (
        <Text className={`ml-2 font-medium ${getTextColor()}`}>
          Message
        </Text>
      )}
    </Pressable>
  );
}
