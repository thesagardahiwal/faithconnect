import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useFollows } from '@/hooks/useFollows';
import { useLeaders } from '@/hooks/useLeaders';
import { useUser } from '@/hooks/useUser';
import { storage } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';

function getProfileImageUrl(imgId: string | undefined): string | null {
  if (!imgId) return null;
  try {
    return storage.getFileViewURL(APPWRITE_CONFIG.buckets.postMedia, imgId).toString();
  } catch {
    return null;
  }
}

function LeaderCard({ leader, isFollowed, isToggling, onPress, onFollowPress }: {
  leader: any;
  isFollowed: boolean;
  isToggling: boolean;
  onPress: () => void;
  onFollowPress: () => void;
}) {
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const url = getProfileImageUrl(leader.photoUrl);
    setProfileImgUrl(url);
    setImgFailed(false);
  }, [leader.photoUrl]);

  const getFaithEmoji = (faith: string) => {
    const emojiMap: Record<string, string> = {
      Christian: '✝️',
      Muslim: '☪️',
      Jewish: '✡️',
      Buddhist: '☸️',
      Hindu: '🕉️',
      Sikh: '🪯',
      Other: '🌈',
    };
    return emojiMap[faith] || '🌈';
  };

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl bg-surface dark:bg-dark-surface p-4 shadow-sm border border-border dark:border-dark-border"
    >
      <View className="flex-row items-center">
        {/* Profile Image */}
        <View className="mr-3">
          <View
            className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden"
          >
            {profileImgUrl && !imgFailed ? (
              <Image
                source={{ uri: profileImgUrl }}
                style={{ width: 64, height: 64 }}
                contentFit="cover"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <Ionicons name="person" size={32} color="#9CA3AF" />
            )}
          </View>
        </View>

        {/* Leader Info */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg font-bold text-text-primary dark:text-dark-text-primary mr-2">
              {leader.name}
            </Text>
            {leader.faith && (
              <View className="flex-row items-center">
                <Text className="text-sm mr-1">{getFaithEmoji(leader.faith)}</Text>
                <Text className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  {leader.faith}
                </Text>
              </View>
            )}
          </View>
          {leader.bio && (
            <Text
              className="text-sm text-text-secondary dark:text-dark-text-secondary mb-2"
              numberOfLines={2}
            >
              {leader.bio}
            </Text>
          )}
        </View>

        {/* Follow Button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            if (!isToggling) {
              onFollowPress();
            }
          }}
          disabled={isToggling}
          className="px-4 py-2 rounded-full border flex-row items-center"
          style={{
            borderColor: isFollowed ? '#6cbf43' : '#2667c9',
            backgroundColor: isFollowed ? '#f0f9f0' : 'transparent',
            opacity: isToggling ? 0.7 : 1,
          }}
        >
          {isToggling ? (
            <ActivityIndicator size="small" color={isFollowed ? '#6cbf43' : '#2667c9'} />
          ) : isFollowed ? (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={18} color="#6cbf43" style={{ marginRight: 4 }} />
              <Text className="text-green-700 font-medium text-sm">Following</Text>
            </View>
          ) : (
            <Text className="text-accent font-medium text-sm">Follow</Text>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function ExploreLeaders() {
  const router = useRouter();
  const { leaders, loading, loadAllLeaders } = useLeaders();
  const { profile } = useUser();
  const { isFollowed, isToggling, _toggleFollow, loadMyLeaders } = useFollows();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllLeaders();
    if (profile?.$id) {
      loadMyLeaders(profile.$id);
    }
  }, [loadAllLeaders, loadMyLeaders, profile?.$id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAllLeaders();
      if (profile?.$id) {
        await loadMyLeaders(profile.$id);
      }
    } finally {
      setRefreshing(false);
    }
  }, [loadAllLeaders, loadMyLeaders, profile?.$id]);

  const filteredLeaders = leaders.filter((leader) =>
    leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leader.faith?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLeaderPress = (leaderId: string) => {
    router.push(`/(worshiper)/leaders/${leaderId}`);
  };

  const handleFollowPress = (leader: any) => {
    if (!profile?.$id) return;
    _toggleFollow(profile.$id, leader.$id);
  };

  if (loading && leaders.length === 0) {
    return (
      <Screen>
        <Header title="Discover Leaders" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Discover Leaders" />

      {/* Search Bar */}
      <View className="mb-4">
        <View className="flex-row items-center bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search leaders..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-text-primary dark:text-dark-text-primary"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Leaders List */}
      {filteredLeaders.length === 0 ? (
        <EmptyState
          text={searchQuery ? 'No leaders found matching your search' : 'No leaders available'}
        />
      ) : (
        <FlatList
          data={filteredLeaders}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <LeaderCard
              leader={item}
              isFollowed={isFollowed(item.$id)}
              isToggling={isToggling(item.$id)}
              onPress={() => handleLeaderPress(item.$id)}
              onFollowPress={() => handleFollowPress(item)}
            />
          )}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Screen>
  );
}
