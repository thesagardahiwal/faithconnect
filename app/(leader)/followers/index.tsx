import EmptyState from '@/components/common/EmptyState';
import Screen from '@/components/common/Screen';
import { useFollows } from '@/hooks/useFollows';
import { useUser } from '@/hooks/useUser';
import { Follow } from '@/types/follow.types';
import { UserProfile } from '@/types/user.types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

export type Follower = Omit<Follow, 'worshiper'> & { worshiper: UserProfile }

function FollowerItem({ follower }: { follower: Follower }) {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const showPlaceholder = !follower?.worshiper || imageError;

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
          source={{ uri: follower.worshiper.photoUrl }}
          className="w-12 h-12 rounded-full bg-surface mr-4"
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      )}
      <View className="flex-1">
        <Text className="text-lg font-medium text-text-primary dark:text-dark-text-primary">
          {follower?.worshiper.name || 'Unknown'}
        </Text>
        <Text className="text-sm text-text-secondary dark:text-dark-text-secondary">
          {follower?.worshiper.faith || '—'}
        </Text>
      </View>
    </View>
  );
}

function FollowersHeader() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View
    className='bg-background dark:bg-dark-background'
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          padding: 6,
          marginRight: 10,
        }}
        accessibilityLabel="Go back"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
      <Text
        className="text-xl font-bold text-text-primary dark:text-dark-text-primary"
        style={{ flexShrink: 1 }}
      >
        Followers
      </Text>
    </View>
  );
}

export default function FollowersScreen() {
  const { profile } = useUser();
  const { myWorshiper, loadMyWorshiper, loading: myWorshiperLoading } = useFollows();
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
    // If we ever support pagination, implement it here.
    // For now, don't show loading as if more items can be loaded.
  }, []);

  // Show a full screen loading indicator on initial load
  if (myWorshiperLoading && (!myWorshiper || myWorshiper.length === 0)) {
    return (
      <Screen>
        <FollowersHeader />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <FollowersHeader />
      {(!myWorshiper || myWorshiper.length === 0) ? (
        <EmptyState text="You don't have any worshipers yet. Once someone follows you, they'll appear here." />
      ) : (
        <FlatList
          data={myWorshiper}
          keyExtractor={(item) => item?.$id}
          renderItem={({ item }) => <FollowerItem follower={item} />}
          // Remove listEnd/pagination UI if not loading more or paginating
          onEndReached={undefined}
          onEndReachedThreshold={undefined}
          ListFooterComponent={
            // Only show spinner if loading more and we actually have data on the screen
            loadingMore
              ? <View className="py-4"><ActivityIndicator /></View>
              : null
          }
        />
      )}
    </Screen>
  );
}
