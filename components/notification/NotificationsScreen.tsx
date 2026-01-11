import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useNotifications } from '@/hooks/useNotifications';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text } from 'react-native';

import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useTheme } from '@/hooks/useTheme';
import { storage } from '@/lib/appwrite';
import { Notification } from '@/types/notification.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePathname } from 'expo-router';
import { View } from 'react-native';

function getProfileImageUrl(imgId?: string): string | null {
    if (!imgId) return null;
    try {
        return storage
            .getFileViewURL(APPWRITE_CONFIG.buckets.postMedia, imgId)
            .toString();
    } catch {
        return null;
    }
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

export default function NotificationsScreen() {
    const { profileId } = useUser();
    const { notifications, markAsRead } = useNotifications(profileId || '');
    const router = useRouter();
    const pathname = usePathname();
    const { isDark } = useTheme();

    const handlePress = (item: Notification) => {
        if (!item.read) {
            markAsRead(item.$id);
        }

        const rolePath = pathname.includes('(leader)') ? '(leader)' : '(worshiper)';

        // Navigation logic based on type
        if (item.type === 'message' && item.chat) {
            const chatId = typeof item.chat === 'object' ? (item.chat as any).$id : item.chat;
            router.push(`/${rolePath}/chats/${chatId}`);
        } else if ((item.type === 'like' || item.type === 'comment') && item.post) {
            const postId = typeof item.post === 'object' ? (item.post as any).$id : item.post;
            router.push(`/${rolePath}/comments/${postId}`);
        } else if (item.type === 'follow' && item.from) {
            const userId = typeof item.from === 'object' ? (item.from as any).$id : item.from;
            router.push(`/${rolePath}/leaders/${userId}`);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return { name: 'heart', color: '#EF4444', bg: 'bg-red-100 dark:bg-red-900/30' };
            case 'comment': return { name: 'chatbubble', color: '#3B82F6', bg: 'bg-blue-100 dark:bg-blue-900/30' };
            case 'follow': return { name: 'person-add', color: '#8B5CF6', bg: 'bg-purple-100 dark:bg-purple-900/30' };
            case 'message': return { name: 'mail', color: '#10B981', bg: 'bg-green-100 dark:bg-green-900/30' };
            default: return { name: 'notifications', color: '#6B7280', bg: 'bg-gray-100 dark:bg-gray-800' };
        }
    };

    const renderItem = ({ item }: { item: Notification }) => {
        const icon = getIcon(item.type);
        const profileImg = getProfileImageUrl(item.from?.photoUrl);

        return (
            <Pressable
                className={`flex-row  items-center px-4 py-4 border rounded-2xl border-border dark:border-dark-border ${!item.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                onPress={() => handlePress(item)}
            >
                {/* Avatar / Icon */}
                <View className="relative mr-4">
                    <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden items-center justify-center">
                        {profileImg ? (
                            <Image
                                source={{ uri: profileImg }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />
                        ) : (
                            <Ionicons name="person" size={24} color="#9CA3AF" />
                        )}
                    </View>
                    {/* Small badge overlay */}
                    <View className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white dark:border-dark-background ${icon.bg}`}>
                        <Ionicons name={icon.name as any} size={12} color={icon.color} />
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1">
                    <Text className="text-sm text-text-primary dark:text-dark-text-primary leading-5">
                        <Text className="font-bold">{item.from?.name || 'Someone'}</Text>
                        <Text> {item.text}</Text>
                    </Text>
                    <Text className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                        {timeAgo(item.$createdAt)}
                    </Text>
                </View>

                {/* Unread Indicator */}
                {!item.read && (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary ml-2" />
                )}
            </Pressable>
        );
    };

    return (
        <Screen>
            <Header title="Notifications" />
            <FlatList
                data={notifications}
                contentContainerClassName='gap-2'
                keyExtractor={(item) => item.$id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <EmptyState
                        title="No Notifications Yet"
                        text="You're all caught up! Check back later for updates."
                    />
                }
            />
        </Screen>
    );
}
