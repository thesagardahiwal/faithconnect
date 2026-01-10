import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useChats } from '@/hooks/useChats';
import { useUser } from '@/hooks/useUser';
import { formatChatTime, getChatPartner } from '@/utils/chat.util';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

export default function ChatsList() {
  const { chats, loadUserChats, loading } = useChats();
  const { profile } = useUser();
  const router = useRouter();

  const hasChats = chats && chats.length > 0;

  // Initial load
  useEffect(() => {
    if (profile) {
      loadUserChats(profile?.$id);
    }
  }, [loadUserChats, profile]);

  const loadMore = () => {
    if (!loading && profile) {
      console.log("LOADING>>>")
      loadUserChats(profile?.$id);
    }
  };

  return (
    <Screen>
      <Header title="Chats" />
        <FlatList
          onRefresh={loadMore}
          refreshing={false}
          data={chats}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const partner = getChatPartner(item, profile!.$id);
            const avatarUrl = partner.photoUrl
              ? partner.photoUrl
              : null;
          
            return (
              <Pressable
                className="flex-row items-center px-4 py-3 border-b border-border dark:border-dark-border"
                onPress={() => router.push({pathname: profile?.role === "leader" ? "/(leader)/chats/[chatId]" : "/(worshiper)/chats/[chatId]", params: {chatId: item.$id, profileId: profile?.$id}})}
              >
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden items-center justify-center">
                  {avatarUrl ? (
                    <Image
                      source={avatarUrl}
                      style={{ width: 48, height: 48 }}
                      contentFit="cover"
                    />
                  ) : (
                    <Ionicons name="person" size={22} color="#9CA3AF" />
                  )}
                </View>
          
                {/* Middle content */}
                <View className="flex-1 ml-3">
                  <Text
                    className="text-text-primary dark:text-dark-text-primary font-semibold"
                    numberOfLines={1}
                  >
                    {partner.name}
                  </Text>
          
                  <Text
                    className="text-text-secondary dark:text-dark-text-secondary text-sm mt-0.5"
                    numberOfLines={1}
                  >
                    {item.lastMessage || 'Say hello 👋'}
                  </Text>
                </View>
          
                {/* Time */}
                {item.lastMessageAt && (
                  <Text className="text-xs text-text-secondary dark:text-dark-text-secondary ml-2">
                    {formatChatTime(item.lastMessageAt)}
                  </Text>
                )}
              </Pressable>
            );
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loading && hasChats ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
          ListEmptyComponent={() => (
            <View className='flex-1 items-center justify-center'>
              <EmptyState
              title="No conversations yet"
              text="Start following leaders to begin chatting."
              actionLabel="Discover Leaders"
              onAction={() => router.push(profile?.role === "leader" ? '/(leader)/leaders' : "/(worshiper)/leaders")}
          />
            </View>
          )}
        />
    </Screen>
  );
}
