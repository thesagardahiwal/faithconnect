import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import ReelCard from '@/components/reel/ReelCard';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LeaderReelsScreen() {
  const { reels, loadReels, reelsLoading } = usePosts();
  const { profile } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Filter reels to show only the current leader's reels
  const myReels = (reels || []).filter(
    (reel) => {
      const leaderId = typeof reel.leader === 'string' ? reel.leader : reel.leader?.$id;
      return leaderId === profile?.$id;
    }
  );

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadReels();
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

  if (myReels.length === 0 && !refreshing && !reelsLoading) {
    return (
      <Screen>
        <Header title="My Reels" />
        <EmptyState text="You haven't created any reels yet. Create your first reel to share with your followers!" />
      </Screen>
    );
  }

  if (reelsLoading && myReels.length === 0) {
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
    <Screen>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <FlatList
          ref={flatListRef}
          data={myReels}
          keyExtractor={(item) => item.$id}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={({ item, index }) => (
            <ReelCard reel={item} isActive={index === activeIndex} />
          )}
          pagingEnabled
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListEmptyComponent={
            <View style={{ height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          }
        />
      </View>
    </Screen>
  );
}
