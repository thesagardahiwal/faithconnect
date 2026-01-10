import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/common/Header';
import PostsList from '@/components/common/LeaderPostsList';
import LeaderReelsList from '@/components/common/LeaderReelsList';
import Screen from '@/components/common/Screen';
import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useFollows } from '@/hooks/useFollows';
import { useLeaders } from '@/hooks/useLeaders';
import { useUser } from '@/hooks/useUser';
import { storage } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import StartChatButton from '../chat/StartChatButton';

function getProfileImageUrl(imgId: string | undefined): string | null {
  if (!imgId) return null;
  try {
    return storage.getFileViewURL(APPWRITE_CONFIG.buckets.postMedia, imgId).toString();
  } catch {
    return null;
  }
}

function getFaithEmoji(faith: string) {
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
}

export default function LeaderProfile() {
  const { leaderId } = useLocalSearchParams<{ leaderId: string }>();
  const router = useRouter();
  const { profile } = useUser();
  const {
    currentLeader,
    leaderPosts,
    leaderReels,
    loadingProfile,
    loadingPosts,
    loadLeaderProfile,
    loadLeaderPosts,
    loadLeaderReels,
    clearLeader,
  } = useLeaders();
  const { isFollowed, isToggling, _toggleFollow, loadMyLeaders } = useFollows();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (leaderId) {
      loadLeaderProfile(leaderId);
      loadLeaderPosts(leaderId);
      loadLeaderReels(leaderId);
    }
    if (profile?.$id) {
      loadMyLeaders(profile.$id);
    }

    return () => {
      clearLeader();
    };
  }, [leaderId, loadLeaderProfile, loadLeaderPosts, loadLeaderReels, loadMyLeaders, profile?.$id, clearLeader]);

  useEffect(() => {
    if (currentLeader?.photoUrl) {
      const url = getProfileImageUrl(currentLeader.photoUrl);
      setProfileImgUrl(url);
      setImgFailed(false);
    }
  }, [currentLeader?.photoUrl]);

  const handleFollowPress = useCallback(() => {
    if (!profile?.$id || !currentLeader?.$id) return;
    _toggleFollow(profile.$id, currentLeader.$id);
  }, [profile?.$id, currentLeader?.$id, _toggleFollow]);

  if (loadingProfile) {
    return (
      <Screen>
        <Header title="Leader Profile" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  if (!currentLeader) {
    return (
      <Screen>
        <Header title="Leader Profile" />
        <EmptyState text="Leader not found" />
      </Screen>
    );
  }

  const isFollowing = isFollowed(currentLeader.$id);
  const isTogglingFollow = isToggling(currentLeader.$id);
  const isOwnProfile = profile?.$id === currentLeader.$id;

  return (
    <Screen>
      {/* ===== Profile Header ===== */}
      <View className="bg-surface dark:bg-dark-surface pb-6 border-b border-border dark:border-dark-border">
        <View className="px-4 pt-4">
          <Pressable onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#2667c9" />
          </Pressable>
  
          <View className="items-center">
            {/* Profile Image */}
            <View className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden mb-4">
              {profileImgUrl && !imgFailed ? (
                <Image
                  source={{ uri: profileImgUrl }}
                  style={{ width: 96, height: 96 }}
                  contentFit="cover"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <Ionicons name="person" size={48} color="#9CA3AF" />
              )}
            </View>
  
            <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {currentLeader.name}
            </Text>
  
            {currentLeader.faith && (
              <Text className="mt-1 text-text-secondary dark:text-dark-text-secondary">
                {getFaithEmoji(currentLeader.faith)} {currentLeader.faith}
              </Text>
            )}
  
            {currentLeader.bio && (
              <Text className="mt-3 text-center text-text-secondary dark:text-dark-text-secondary px-4">
                {currentLeader.bio}
              </Text>
            )}
  
            {!isOwnProfile && profile !== null && (
                <View className='flex-row gap-3 items-center'>
                    <Pressable
                        onPress={handleFollowPress}
                        disabled={isTogglingFollow}
                        className={`mt-4 px-6 py-3 rounded-full flex-row items-center border
                        ${isFollowing ? 'border-success bg-green-50' : 'border-primary'}
                        `}
                    >
                        {isTogglingFollow ? (
                        <ActivityIndicator size="small" />
                        ) : (
                        <>
                            <Ionicons
                            name={isFollowing ? 'checkmark-circle' : 'add-circle-outline'}
                            size={20}
                            color={isFollowing ? '#16A34A' : '#2667c9'}
                            style={{ marginRight: 6 }}
                            />
                            <Text
                            className={`font-semibold ${
                                isFollowing ? 'text-success' : 'text-primary'
                            }`}
                            >
                            {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        </>
                        )}
                    </Pressable>
                    <StartChatButton leaderId={leaderId} worshiperId={profile!.$id} isMeLeader={profile?.role === "leader"} compact={false}/>
                </View>
            )}
          </View>
        </View>
      </View>
  
      {/* ===== Tabs ===== */}
      <View className="flex-row border-b border-border dark:border-dark-border bg-surface dark:bg-dark-surface">
        {(['posts', 'reels'] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 py-4 items-center border-b-2"
            style={{
              borderBottomColor:
                activeTab === tab ? '#2667c9' : 'transparent',
            }}
          >
            <Text
              className={`font-semibold ${
                activeTab === tab
                  ? 'text-primary'
                  : 'text-text-secondary dark:text-dark-text-secondary'
              }`}
            >
              {tab === 'posts'
                ? `Posts (${leaderPosts.length})`
                : `Reels (${leaderReels.length})`}
            </Text>
          </Pressable>
        ))}
      </View>
  
      {/* ===== Content ===== */}
      {loadingPosts ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : activeTab === 'posts' ? (
        leaderPosts.length === 0 ? (
          <EmptyState text="No posts yet" />
        ) : (
        <PostsList posts={leaderPosts} />
        )
      ) : leaderReels.length === 0 ? (
        <EmptyState text="No reels yet" />
      ) : (
        <LeaderReelsList reels={leaderReels} />
      )}
    </Screen>
  );
  
}
