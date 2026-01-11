import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useFollows } from '@/hooks/useFollows';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function StatCard({
  label,
  value,
  icon,
  iconBg,
  onPress,
  highlight,
  bgGradient,
}: {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  iconBg?: string;
  onPress?: () => void;
  highlight?: boolean;
  bgGradient?: string;
}) {
  const Card = onPress ? TouchableOpacity : View;
  return (
    <Card
      onPress={onPress}
      activeOpacity={0.8}
      className={`
        w-[48%] rounded-2xl p-5 mb-4 border
        bg-surface dark:bg-dark-surface
        border-border dark:border-dark-border 
        shadow-sm
        ${highlight ? 'shadow-lg border-primary dark:border-dark-primary bg-primary-soft dark:bg-dark-primary-soft' : ''}
      `}
    >
      <View className="flex-row items-center mb-2">
        {icon && (
          <View
            className={
              `rounded-full p-3 mr-3 bg-primary-soft dark:bg-dark-primary-soft`
            }
            style={iconBg ? { backgroundColor: iconBg } : {}}
          >
            {icon}
          </View>
        )}
        <Text className="text-base font-bold text-text-primary dark:text-dark-text-primary">
          {label}
        </Text>
      </View>
      <Text className="mt-1 text-3xl font-extrabold text-accent dark:text-dark-accent">
        {value}
      </Text>
      {onPress && (
        <Text className="mt-2 text-xs font-semibold text-primary dark:text-dark-primary">
          View →
        </Text>
      )}
    </Card>
  );
}

function WelcomeBanner({ name }: { name?: string }) {
  return (
    <View
      className={
        `mx-4 mt-6 mb-4 rounded-xl p-5 bg-gradient-to-r from-primary-soft to-primary
         dark:bg-gradient-to-r dark:from-dark-primary-soft dark:to-dark-primary flex-row items-center`
      }
      style={{
        // fallback for react-native (doesn't support bg-gradient), provide a nice color
        backgroundColor: '#E8F0FE',
      }}
    >
      <Ionicons
        name="sparkles"
        size={32}
        color="#C9A24D"
        style={{ marginRight: 16 }}
      />
      <View>
        <Text className="text-lg font-bold text-primary dark:text-dark-primary mb-0.5">
          Welcome back{ name ? `, ${name}` : '!' }
        </Text>
        <Text className="text-text-secondary dark:text-dark-text-secondary text-sm">
          Here‘s your inspiration dashboard. 
        </Text>
        <Text className="text-text-secondary dark:text-dark-text-secondary text-sm">
          Track your impact and grow your ministry.
        </Text>
      </View>
    </View>
  );
}

function QuickLinks({ router, leaderId }: { router: any; leaderId?: string }) {
  return (
    <View className="mx-4 mt-2 mb-5 flex-row flex-wrap justify-between">
      {/* Create Post */}
      <TouchableOpacity
        onPress={() => router.push('/(leader)/create/post')}
        className="w-[48%] mb-3 p-3 rounded-xl bg-primary-soft dark:bg-dark-primary-soft flex-row items-center"
        activeOpacity={0.85}
      >
        {/* fallback to a valid MaterialCommunityIcons name */}
        <MaterialCommunityIcons name="square-edit-outline" size={22} color="#2F6FED" style={{ marginRight: 8 }} />
        <Text className="ml-2 text-primary dark:text-dark-primary font-semibold text-[17px]">New Post</Text>
      </TouchableOpacity>
      {/* Create Reel */}
      <TouchableOpacity
        onPress={() => router.push('/(leader)/create/reel')}
        className="w-[48%] mb-3 p-3 rounded-xl bg-accent/20 dark:bg-dark-accent/30 flex-row items-center"
        activeOpacity={0.85}
      >
        <Feather name="video" size={20} color="#C9A24D" />
        <Text className="ml-2 text-accent dark:text-dark-accent font-semibold text-[17px]">New Reel</Text>
      </TouchableOpacity>
      {/* My Profile */}
      <TouchableOpacity
        onPress={() => leaderId && router.push(`/(leader)/leaders/${leaderId}`)}
        className="w-[48%] mb-1 p-3 rounded-xl bg-primary/10 dark:bg-dark-primary/20 flex-row items-center"
        activeOpacity={0.85}
      >
        <Feather name="user" size={20} color="#2F6FED" />
        <Text className="ml-2 text-primary dark:text-dark-primary font-semibold text-[17px]">My Profile</Text>
      </TouchableOpacity>
      {/* Go to Chats */}
      <TouchableOpacity
        onPress={() => router.push('/(leader)/chats')}
        className="w-[48%] mb-1 p-3 rounded-xl bg-surface dark:bg-dark-surface flex-row items-center border border-border dark:border-dark-border"
        activeOpacity={0.85}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#5B8CFF" />
        <Text className="ml-2 text-primary dark:text-dark-primary font-semibold text-[17px]">Chats</Text>
      </TouchableOpacity>
    </View>
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
      setTimeout(() => setRefreshing(false), 600); // add smooth refresh
    }
  }, [loadExplore, loadMyWorshiper, loadReels, profile?.$id]);

  return (
    <Screen>
      <Header title="Dashboard" />

      {profile?.name && <WelcomeBanner name={profile.name.split(' ')[0]} />}

      <QuickLinks router={router} leaderId={profile?.$id} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 38 }}
        className="flex-1"
      >
        <Text className="ml-4 mt-1 mb-2 text-lg font-bold text-text-secondary dark:text-dark-text-secondary">
          My Ministry Summary
        </Text>
        <View className="flex-row flex-wrap justify-between px-4 pt-1">
          {/* Posts */}
          <StatCard
            label="Total Posts"
            value={myPosts.length}
            icon={<MaterialCommunityIcons name="post" size={24} color="#2F6FED" />}
            onPress={() => router.push(`/(leader)/leaders/${profile?.$id}`)}
          />

          {/* Followers */}
          <StatCard
            label="Followers"
            value={myWorshiper.length}
            icon={<Feather name="users" size={22} color="#C9A24D" />}
            iconBg="#fff9ea"
            onPress={() => router.push('/(leader)/followers')}
            highlight
          />

          {/* Reels */}
          <StatCard
            label="Reels"
            value={myReels.length}
            icon={<Feather name="video" size={22} color="#4a35df" />}
            iconBg="#edeafb"
            onPress={() => router.push(`/(leader)/leaders/${profile?.$id}`)}
          />

          {/* Chats */}
          <StatCard
            label="Active Chats"
            value={0} // Should be a number or string instead of JSX - update if you have a chats count
            icon={<Ionicons name="chatbubbles" size={22} color="#67e8f9" />}
            iconBg="#e0fcff"
            onPress={() => router.push('/(leader)/chats')}
          />
        </View>
        {/* Motivation Section */}
        <View className="mt-8 mx-4 p-5 rounded-2xl bg-background dark:bg-dark-background border border-border dark:border-dark-border">
          <Text className="font-bold text-xl mb-2 text-primary dark:text-dark-primary">Keep Inspiring!</Text>
          <Text className="text-text-secondary dark:text-dark-text-secondary text-base mb-4">
            “And let us consider how we may spur one another on toward love and good deeds.” (Hebrews 10:24)
          </Text>
          <View className="flex-row mt-1">
            <Ionicons name="bulb-outline" size={22} color="#C9A24D" />
            <Text className="ml-2 text-accent dark:text-dark-accent font-semibold">
              Tip:
            </Text>
            <Text className="ml-2 w-[80%] text-text-secondary dark:text-dark-text-secondary">
              Engage with your followers regularly and share meaningful stories for greater impact!
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
