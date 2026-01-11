import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import PostCard from '@/components/post/PostCard';
import { useFollows } from '@/hooks/useFollows';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

type TabType = 'explore' | 'following';

export default function WorshiperHome() {
  const router = useRouter();
  const { explore: posts, loadExplore } = usePosts();
  const { profile } = useUser();
  const { myLeaders, loadMyLeaders } = useFollows();
  const explore = posts.map(post => {
    const leaderId =
      typeof post.leader === 'string'
        ? post.leader
        : post.leader?.$id;
  
    return {
      ...post,
      isFollowed: myLeaders.some(l => l.leader === leaderId),
    };
  });
  const [activeTab, setActiveTab] = useState<TabType>('explore');

  useEffect(() => {
    loadExplore();
  }, [loadExplore]);

  useEffect(() => {
    if (profile) {
      loadMyLeaders(profile.$id);
    }
  }, [loadMyLeaders, profile]);

  // 🔹 Compute following posts
  const followingPosts = useMemo(() => {
    if (!myLeaders?.length) return [];

    const leaderIds = new Set(myLeaders.map(l => l.leader));

    return explore.filter(post => {
      const leaderId =
        typeof post.leader === 'string'
          ? post.leader
          : post.leader?.$id;

      return leaderId && leaderIds.has(leaderId);
    });
  }, [explore, myLeaders]);

  const data = activeTab === 'explore' ? explore : followingPosts;

  return (
    <Screen>
      <Header
        title="Explore"
        right={
          <Pressable onPress={() => router.push('/(worshiper)/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#2667c9" />
          </Pressable>
        }
      />

      {/* 🔹 Tabs */}
      <View className="flex-row border-b border-border dark:border-dark-border">
        <Pressable
          onPress={() => setActiveTab('explore')}
          className="flex-1 py-3 items-center"
        >
          <Text
            className={`font-semibold ${
              activeTab === 'explore'
                ? 'text-accent'
                : 'text-text-secondary dark:text-dark-text-secondary'
            }`}
          >
            Explore
          </Text>
          {activeTab === 'explore' && (
            <View className="h-0.5 w-12 bg-accent mt-2 rounded-full" />
          )}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('following')}
          className="flex-1 py-3 items-center"
        >
          <Text
            className={`font-semibold ${
              activeTab === 'following'
                ? 'text-accent'
                : 'text-text-secondary dark:text-dark-text-secondary'
            }`}
          >
            Following
          </Text>
          {activeTab === 'following' && (
            <View className="h-0.5 w-12 bg-accent mt-2 rounded-full" />
          )}
        </Pressable>
      </View>

      {/* 🔹 Feed */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        onRefresh={loadExplore}
        refreshing={false}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <EmptyState
            title={
              activeTab === 'explore'
                ? 'No posts to explore'
                : 'No posts from followed leaders'
            }
            text={
              activeTab === 'explore'
                ? 'Pull to refresh or check back later.'
                : 'Follow leaders to see their posts here.'
            }
            actionLabel={
              activeTab === 'following' ? 'Discover Leaders' : undefined
            }
            onAction={
              activeTab === 'following'
                ? () => router.push('/(worshiper)/leaders')
                : undefined
            }
          />
        }
      />
    </Screen>
  );
}
