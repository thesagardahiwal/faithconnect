import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useFollows } from '@/hooks/useFollows';
import { useLikes } from '@/hooks/useLikes';
import { useUser } from '@/hooks/useUser';
import { storage } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

// Simple time ago function
function timeAgo(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function getPreviewUrl(mediaId: string): string | null {
  if (!mediaId) return null;
  try {
    const fileViewUrl = storage.getFileViewURL(
      APPWRITE_CONFIG.buckets.postMedia,
      mediaId
    );
    return fileViewUrl.toString();
  } catch (err) {
    console.error(`[getPreviewUrl] Failed to get preview url for mediaId: ${mediaId}`, err);
    return null;
  }
}

function getProfileImageUrl(imgId: string): string | null {
  if (!imgId) return null;
  try {
    return storage.getFileViewURL(APPWRITE_CONFIG.buckets.postMedia, imgId).toString();
  } catch {
    return null;
  }
}

function isImageMediaUrl(mediaUrl: string) {
  return !!mediaUrl;
}

function getLeaderFaith(leaderData: any) {
  return leaderData?.faith || undefined;
}

function getLeaderName(leaderData: any) {
  if (!leaderData) return 'Unknown';
  return leaderData.name ? leaderData.name : 'Unknown';
}

function getLeaderProfileImgId(leaderData: any) {
  if (!leaderData) return null;
  return leaderData.photoUrl || null;
}

export default function PostCard({ post }: any) {
  const router = useRouter();
  const { profile } = useUser();

  const {
    _toggleFollow: toggleFollowApi,
    isFollowed: isFollowedGlobal,
    isToggling: isTogglingGlobal,
    loading: loadingFollowGlobal,
  } = useFollows();

  const { liked, likesCount, loading: likeLoading, toggleLike } = useLikes({
    postId: post.$id,
    initialLikesCount: post.likesCount || 0,
  });

  const isOwnPost =
    post.leader === profile?.$id || post.leader?.$id === profile?.$id;

  const leaderData = post.leader || {};
  const leaderId = leaderData?.$id || post.leader;
  const leaderImgId = getLeaderProfileImgId(leaderData);

  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [profileImgFailed, setProfileImgFailed] = useState(false);

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sync follow state directly with redux (no local isFollowed state)
  const isFollowed = isFollowedGlobal(leaderId);
  const isTogglingFollow = isTogglingGlobal(leaderId);

  // Only track follow loading while global loading
  const loadingFollow = loadingFollowGlobal;

  useEffect(() => {
    setProfileImgFailed(false);

    let url: string | null = null;
    if (leaderImgId) {
      url = getProfileImageUrl(leaderImgId);
      if (__DEV__) {
        console.debug('[PostCard] profileImgUrl:', url);
      }
      setProfileImgUrl(url ?? null);
    } else {
      setProfileImgUrl(null);
    }
    // No async/await needed, Appwrite SDK returns URL synchronously for view URL
    // Only reload if user id or imgId changes
     
  }, [leaderImgId]);

  useEffect(() => {
    let url: string | null = null;
    if (post.mediaUrl && isImageMediaUrl(post.mediaUrl)) {
      url = getPreviewUrl(post.mediaUrl);
      // If running in development, log the generated preview image URL for debugging purposes
      if (__DEV__) {
        console.debug('[PostCard] post img preview url:', url);
      }
      setImgUrl(url);
    } else {
      setImgUrl(null);
    }
  }, [post.mediaUrl]);

  // Prepare leader values
  const leaderDisplay = getLeaderName(leaderData);
  const leaderFaith = getLeaderFaith(leaderData);
  const postedAt = post.$createdAt || post.createdAt;
  const showFaith = Boolean(leaderFaith);

  // Simple follow handler (no async/await, no local setIsFollowed)
  const handleToggleFollow = useCallback(() => {
    // Ensure profile and leaderId are valid before proceeding
    if (!profile?.$id || !leaderId || loadingFollow) {
      console.warn('[PostCard] Cannot toggle follow: missing profile or leaderId', {
        hasProfile: !!profile?.$id,
        leaderId,
        loadingFollow
      });
      return;
    }
    toggleFollowApi(profile.$id, leaderId);
    // Redux will update isFollowedGlobal as needed.
  }, [profile?.$id, leaderId, toggleFollowApi, loadingFollow]);

  return (
    <View className="mb-4 rounded-2xl bg-surface dark:bg-dark-surface p-4 shadow-md">

      {/* Header with who posted, profile image, leader, faith, and time */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
      }}>
        {/* Profile image, fallback icon, or initials */}
        <View style={{
          width: 44, height: 44, borderRadius: 22, backgroundColor: '#EBEEFA',
          justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
        }}>
          {profileImgUrl && !profileImgFailed ? (
            <Image
              source={profileImgUrl}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#DDE3F2',
              }}
              contentFit="cover"
              onError={() => setProfileImgFailed(true)}
              accessibilityLabel="Poster profile image"
            />
          ) : profileImgFailed ? (
            <Ionicons name="person-circle-outline" size={40} color="#B8BCD6" />
          ) : (
            <Ionicons name="person-outline" size={32} color="#B8BCD6" />
          )}
        </View>
        {/* Leader name, faith, and time */}
        <View className="flex-1 flex-col">
          <View className="flex-row items-center flex-wrap">
            <Pressable
              onPress={() => {
                if (leaderId) {
                  router.push(`/${profile?.role === "worshiper" ? "(worshiper)"  : "(leader)"}/leaders/${leaderId}`);
                }
              }}
            >
              <Text
                className="font-bold text-text-primary dark:text-dark-text-primary text-base mr-2"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ maxWidth: 150 }}
              >
                {leaderDisplay}
              </Text>
            </Pressable>
            {showFaith && leaderFaith && (
              <View className="flex-row items-center mr-2 mb-0.5">
                {/* Use faith emoji or icon, then text */}
                <Text
                  className="font-medium text-xs tracking-tight"
                  style={{ marginRight: 3 }}
                >
                  {leaderFaith === "Christian" && "✝️"}
                  {leaderFaith === "Muslim" && "☪️"}
                  {leaderFaith === "Jewish" && "✡️"}
                  {leaderFaith === "Buddhist" && "☸️"}
                  {leaderFaith === "Hindu" && "🕉️"}
                  {leaderFaith === "Sikh" && "🪯"}
                  {leaderFaith === "Other" && "🌈"}
                </Text>
                <Text className="text-text-secondary dark:text-dark-text-secondary font-medium text-xs tracking-tight">
                  {leaderFaith}
                </Text>
              </View>
            )}
          </View>
          {/* Time */}
          <Text className="text-xs mt-0.5 font-normal text-text-secondary dark:text-dark-text-secondary">
            {timeAgo(postedAt)}
          </Text>
        </View>
        {/* Follow/Unfollow button, not if it's own post */}
        {!isOwnPost && (
          <Pressable
            className="px-4 py-2 rounded-full border border-accent flex-row items-center justify-center"
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#fff1f7" : "transparent",
                minWidth: 90,
                opacity: isTogglingFollow ? 0.7 : 1,
              },
            ]}
            onPress={handleToggleFollow}
            disabled={isTogglingFollow}
          >
            {isTogglingFollow ? (
              <ActivityIndicator size="small" color={isFollowed ? "#6cbf43" : "#2667c9"} style={{ marginRight: 6 }} />
            ) : isFollowed ? (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="#6cbf43" style={{ marginRight: 4 }} />
                <Text className="text-green-700 font-medium">Following</Text>
              </>
            ) : (
              <Text className="text-accent font-medium">Follow</Text>
            )}
          </Pressable>
        )}
      </View>

      {/* Show image if available */}
      {imgUrl && (
        <>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: imgUrl }}
              style={{
                width: '100%',
                height: 220,
                borderRadius: 16,
                marginBottom: 14,
                backgroundColor: '#efefef', // fallback background
              }}
              contentFit="cover"
            />
          </Pressable>

          {/* Fullscreen Modal */}
          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.95)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: imgUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                  backgroundColor: '#000',
                }}
                contentFit="contain"
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 48,
                  right: 0,
                  padding: 12,
                  borderRadius: 24,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Close Image"
              >
                <Ionicons name="close" size={36} color="#fff" />
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}

      {post.text ? (
        <Text className="mt-1 font-semibold text-text-primary dark:text-dark-text-primary text-base">
          {post.text}
        </Text>
      ) : null}

      <View className="mt-4 flex-row items-center justify-between">
        {/* Like Button with count and toggle */}
        <Pressable
          className="flex-row items-center rounded-full"
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#f6f6fa" : "#fff",
              borderColor: liked ? "#e53935" : "#2667c9",
              borderWidth: 1.5,
              paddingVertical: 10,
              paddingHorizontal: 18,
              shadowColor: "#5770be",
              shadowOpacity: pressed ? 0.20 : 0.08,
              shadowRadius: pressed ? 9 : 5,
              shadowOffset: { width: 0, height: 1 },
              opacity: likeLoading ? 0.7 : 1,
              elevation: pressed ? 2 : 1,
              minWidth: 85,
            },
          ]}
          onPress={toggleLike}
          disabled={likeLoading}
          accessibilityLabel={liked ? "Unlike" : "Like"}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={22}
            color={liked ? "#e53935" : "#2667c9"}
            style={{
              marginRight: 8,
              transform: [{ scale: liked ? 1.15 : 1 }],
            }}
          />
          <Text
            className={`mr-1 ${liked
              ? "text-error font-bold"
              : "text-accent font-medium"} text-base tracking-wide`}
          >
            {liked ? "Liked" : "Like"}
          </Text>
          <Text
            className="text-text-secondary dark:text-dark-text-secondary text-sm mr-1"
            style={{
              marginRight: likeLoading ? 6 : 0,
              minWidth: 28,
              textAlign: "right"
            }}
          >
            {likesCount || post.likesCount}
          </Text>
          {likeLoading && (
            <ActivityIndicator
              size="small"
              color={liked ? "#e53935" : "#2667c9"}
              style={{ marginLeft: 5 }}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
