import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useFollows } from '@/hooks/useFollows';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function StatCard({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number | string;
  onPress?: () => void;
}) {
  const Card = onPress ? TouchableOpacity : View;

  return (
    <Card
      onPress={onPress}
      activeOpacity={0.8}
      className="w-[48%] rounded-xl bg-surface dark:bg-dark-surface p-4 mb-4 border border-border dark:border-dark-border"
    >
      <Text className="text-sm text-text-secondary dark:text-dark-text-secondary">
        {label}
      </Text>
      <Text className="mt-2 text-2xl font-bold text-text-primary dark:text-dark-text-primary">
        {value}
      </Text>
      {onPress && (
        <Text className="mt-1 text-xs text-primary">
          View →
        </Text>
      )}
    </Card>
  );
}


export default function LeaderDashboard() {
  const router = useRouter();
  const { profile, loadProfile } = useUser();
  const { user } = useAuth();
  const { explore = [], reels = [], loadExplore, loadReels } = usePosts();
  const { myWorshiper = [], loadMyWorshiper } = useFollows();
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Derived data (clean + memoized)
  const myPosts = useMemo(
    () =>
      explore.filter((p) =>
        typeof p.leader === 'string'
          ? p.leader === profile?.$id
          : p.leader?.$id === profile?.$id
      ),
    [explore, profile?.$id]
  );

  const myReels = useMemo(
    () =>
      reels.filter((r) =>
        typeof r.leader === 'string'
          ? r.leader === profile?.$id
          : r.leader?.$id === profile?.$id
      ),
    [reels, profile?.$id]
  );

  useEffect(() => {
    if (user && !profile) {
      loadProfile(user.$id);
    }
  }, [user, profile, loadProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      loadExplore();
      loadReels();
      if (profile?.$id) {
        loadMyWorshiper(profile.$id);
      }
    } finally {
      setRefreshing(false);
    }
  }, [loadExplore, loadMyWorshiper, loadReels, profile?.$id]);

  return (
    <Screen>
      <Header title="Dashboard" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-row flex-wrap justify-between px-4 pt-4">
          {/* Posts */}
          <StatCard
            label="Total Posts"
            value={myPosts.length}
            onPress={() => router.push(`/(leader)/leaders/${profile?.$id}`)}
          />

          {/* Followers */}
          <StatCard
            label="Followers"
            value={myWorshiper.length}
            onPress={() => router.push('/(leader)/followers')}
          />

          {/* Reels */}
          <StatCard
            label="Reels"
            value={myReels.length}
            onPress={() => router.push(`/(leader)/leaders/${profile?.$id}`)}
          />

          {/* Chats */}
          <StatCard
            label="Active Chats"
            value="View"
            onPress={() => router.push('/(leader)/chats')}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
