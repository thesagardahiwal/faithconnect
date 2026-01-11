import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import ReelCard from '@/components/reel/ReelCard';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LeaderReelsScreen() {
  const { reels, loadReels, reelsLoading } = usePosts();
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { profile } = useUser();

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      loadReels();
    } finally {
      setRefreshing(false);
    }
  }, [loadReels]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  if (reelsLoading) {
    return (
      <Screen>
        <Header title="My Reels" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
      <View className='' style={{ flex: 1, backgroundColor: '#000', padding: 10}}>
        <FlatList
          ref={flatListRef}
          data={reels}
          keyExtractor={(item) => item.$id}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={({ item, index }) => (
            <ReelCard onPress={() => {
              if (profile && profile.role === "leader") {
                if (profile.$id !== item.$id) {
                  router.push({pathname: "/(leader)/leaders/[leaderId]", params: {leaderId: item.$id}});
                } else {
                  router.push("/(leader)/profile");
                }
              }

              if (profile && profile.role === "worshiper") {
                router.push({pathname: "/(worshiper)/leaders/[leaderId]", params: {leaderId: item.$id}});
              }
            }} reel={item} isActive={index === activeIndex} />
          )}
          pagingEnabled
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListEmptyComponent={
            <EmptyState
              title="No reels yet"
              text="There are no reels available at the moment. Pull to refresh or check back later!"
            />
          }
        />
      </View>
  );
}
