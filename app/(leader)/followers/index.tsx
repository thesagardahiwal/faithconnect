import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useFollows } from '@/hooks/useFollows';
import { useUser } from '@/hooks/useUser';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

function FollowerItem({ follower }: { follower: any }) {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const showPlaceholder = !follower?.profileImage || imageError;

  return (
    <View className="flex-row items-center p-4 border-b border-surface/40 dark:border-dark-surface/40">
      {showPlaceholder ? (
        <View className="w-12 h-12 rounded-full bg-surface mr-4 items-center justify-center">
          <MaterialIcons
            name="account-circle"
            size={48}
            color={theme.colors.text + '55' /* light gray */}
            style={{}}
          />
        </View>
      ) : (
        <Image
          source={{ uri: follower.profileImage }}
          className="w-12 h-12 rounded-full bg-surface mr-4"
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      )}
      <View className="flex-1">
        <Text className="text-lg font-medium text-text-primary dark:text-dark-text-primary">
          {follower?.name || 'Unknown'}
        </Text>
        <Text className="text-sm text-text-secondary dark:text-dark-text-secondary">
          {follower?.faith || '—'}
        </Text>
      </View>
    </View>
  );
}

export default function FollowersScreen() {
  const { profile } = useUser();
  const { myWorshiper, loadMyWorshiper, loading : myWorshiperLoading } = useFollows();
  const [loadingMore, setLoadingMore] = useState(false);

  // Load followers on mount
  useEffect(() => {
    if (profile?.$id) {
      loadMyWorshiper(profile.$id);
    }
    // Only on mount or when profile changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.$id]);

  const handleLoadMore = useCallback(() => {
    if (
      !loadingMore &&
      !myWorshiperLoading &&
      profile?.$id
    ) {
      setLoadingMore(true);
      Promise.resolve(
        loadMyWorshiper(profile.$id)
      ).finally(() => setLoadingMore(false));
    }
  }, [loadingMore, myWorshiperLoading, loadMyWorshiper, profile?.$id]);

  return (
    <Screen>
      <Header title="Followers" />
      {(!myWorshiper || myWorshiper.length === 0) && !myWorshiperLoading ? (
        <EmptyState text="You don't have any worshipers yet. Once someone follows you, they'll appear here." />
      ) : (
        <FlatList
          data={myWorshiper}
          keyExtractor={(item) => item?.$id}
          renderItem={({ item }) => <FollowerItem follower={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            (myWorshiperLoading || loadingMore)
              ? <View className="py-4"><ActivityIndicator /></View>
              : null
          }
        />
      )}
    </Screen>
  );
}
