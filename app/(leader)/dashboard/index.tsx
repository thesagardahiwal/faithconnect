import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useFollows } from '@/hooks/useFollows';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function StatCard({ label, value }: any) {
  return (
    <View className="w-[48%] rounded-xl bg-surface dark:bg-dark-surface p-4 mb-4">
      <Text className="text-sm text-text-secondary dark:text-dark-text-secondary">
        {label}
      </Text>
      <Text className="mt-2 text-2xl font-bold text-text-primary dark:text-dark-text-primary">
        {value}
      </Text>
    </View>
  );
}

export default function LeaderDashboard() {
  const { profile, loadProfile } = useUser();
  const { user } = useAuth();
  const { explore, exploreLoading, reels, loadExplore } = usePosts();
  const { myWorshiper, loadMyWorshiper } = useFollows()
  const [refreshing, setRefreshing] = useState(false);

  const myPosts = (explore || []).filter(
    (post) => typeof post.leader !== 'string' ? post.leader?.$id === profile?.$id : post.leader === profile?.$id
  );


  const myReels = (reels || []).filter(
    (reels) => typeof reels.leader !== 'string' ? reels.leader?.$id === profile?.$id : reels.leader === profile?.$id
  );

  useEffect(() => {
    if (user && !profile) {
        loadProfile(user.$id);
    }
  }, [user, profile, loadProfile]);
  // Handle pull down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      if (typeof loadExplore === 'function') {
        loadExplore();
      };
      if (typeof loadMyWorshiper === 'function' && profile) {
        loadMyWorshiper(profile.$id);
      };
    } finally {
      setRefreshing(false);
    }
  }, [loadExplore, loadMyWorshiper, profile]);

  return (
    <Screen>
      <Header title="Dashboard" />
      {/* Pull-to-refresh + Scroll + floating refresh button */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-row flex-wrap justify-between">
          <StatCard label="Total Posts" value={myPosts.length} />
          <StatCard label="Followers" value={myWorshiper.length} />
          <StatCard label="Reels" value={myReels.length} />
          <StatCard label="Active Chats" value="—" />
        </View>
      </ScrollView>
      {/* Floating Refresh Button */}
      <TouchableOpacity
        onPress={onRefresh}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 40,
          backgroundColor: '#fff',
          borderRadius: 999,
          padding: 12,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>⟳</Text>
      </TouchableOpacity>
    </Screen>
  );
}
