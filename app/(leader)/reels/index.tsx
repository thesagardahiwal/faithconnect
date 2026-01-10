import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import ReelCard from '@/components/reel/ReelCard';
import { usePosts } from '@/hooks/usePosts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LeaderReelsScreen() {
  const { reels, loadReels, reelsLoading } = usePosts();
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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

  if (reelsLoading && reels.length === 0) {
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
      <View style={{ flex: 1, backgroundColor: '#000'}}>
        <FlatList
          ref={flatListRef}
          data={reels}
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
