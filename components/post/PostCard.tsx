import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useFollows } from '@/hooks/useFollows';
import { useLikes } from '@/hooks/useLikes';
import { useUser } from '@/hooks/useUser';
import { storage } from '@/lib/appwrite';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

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

// --- Upcoming Modal Content for Extra Feature ---
const upcomingModalContent = [
  {
    title: "Upcoming Feature",
    subtitle: "We're working on awesome updates!",
    points: [
      "Save & Bookmark Posts",
      "Commenting coming soon",
      "Post sharing",
      "Personalized recommendations",
    ],
  }
];
const screen = Dimensions.get('window');

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

  const isOwnPost = post.leader === profile?.$id || post.leader?.$id === profile?.$id;
  const leaderData = post.leader || {};
  const leaderId = leaderData?.$id || post.leader;
  const leaderImgId = getLeaderProfileImgId(leaderData);

  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [profileImgFailed, setProfileImgFailed] = useState(false);

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // For upcoming modal
  const [upcomingModalVisible, setUpcomingModalVisible] = useState(false);

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
      setProfileImgUrl(url ?? null);
    } else {
      setProfileImgUrl(null);
    }
  }, [leaderImgId]);

  useEffect(() => {
    let url: string | null = null;
    if (post.mediaUrl && isImageMediaUrl(post.mediaUrl)) {
      url = getPreviewUrl(post.mediaUrl);
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

  // Simple follow handler
  const handleToggleFollow = useCallback(() => {
    if (!profile?.$id || !leaderId || loadingFollow) return;
    toggleFollowApi(profile.$id, leaderId);
  }, [profile?.$id, leaderId, toggleFollowApi, loadingFollow]);

  return (
    <View className="rounded-2xl mb-6 bg-surface dark:bg-dark-surface shadow border border-tint-3 overflow-hidden relative">
      {/* Decorative Top Bar */}
      <View className="h-2 bg-gradient-to-r from-brand/10 via-primary/10 to-accent/10" />

      {/* Container */}
      <View className="px-4 pt-3 pb-2">
        {/* Header Section */}
        <View className="flex-row items-start mb-4 gap-x-4">
          {/* Profile */}
          <Pressable
            className="overflow-hidden rounded-full border-2 border-tint-2 shadow-sm"
            style={{ width: 54, height: 54, backgroundColor: '#f3f4fa' }}
            onPress={() => {
              if (leaderId) {
                router.push(`/${profile?.role === "worshiper" ? "(worshiper)" : "(leader)"}/leaders/${leaderId}`);
              }
            }}
          >
            {profileImgUrl && !profileImgFailed ? (
              <Image
                source={profileImgUrl}
                style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: '#f3f4fa' }}
                contentFit="cover"
                onError={() => setProfileImgFailed(true)}
                accessibilityLabel="Poster profile image"
              />
            ) : profileImgFailed ? (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="person-circle-outline" size={46} color="#B8BCD6" />
              </View>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="person-outline" size={34} color="#B8BCD6" />
              </View>
            )}
          </Pressable>
          {/* Main header: Name, faith, time */}
          <View className="flex-1 flex-col">
            <View className="flex-row items-center flex-wrap">
              <Pressable
                onPress={() => {
                  if (leaderId) {
                    router.push(`/${profile?.role === "worshiper" ? "(worshiper)" : "(leader)"}/leaders/${leaderId}`);
                  }
                }}
              >
                <Text
                  className="font-bold text-lg tracking-tight text-text-primary dark:text-dark-text-primary mr-2 max-w-[150px]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {leaderDisplay}
                </Text>
              </Pressable>
              {showFaith && leaderFaith &&
                <View className="flex-row items-center mr-2 mb-0.5">
                  <Text className="font-semibold text-base mr-1">
                    {leaderFaith === "Christian" && "✝️"}
                    {leaderFaith === "Muslim" && "☪️"}
                    {leaderFaith === "Jewish" && "✡️"}
                    {leaderFaith === "Buddhist" && "☸️"}
                    {leaderFaith === "Hindu" && "🕉️"}
                    {leaderFaith === "Sikh" && "🪯"}
                    {leaderFaith === "Other" && "🌈"}
                  </Text>
                  <Text className="text-sm font-semibold text-tint-4 text-text-primary dark:text-dark-text-primary">
                    {leaderFaith}
                  </Text>
                </View>
              }
            </View>
            <View className="flex-row items-center gap-x-2 mt-1">
              <Ionicons name="time-outline" size={13} color="#b7a1e6" />
              <Text className="text-xs font-normal text-tint-5 text-text-primary dark:text-dark-text-primary">
                {timeAgo(postedAt)}
              </Text>
            </View>
          </View>
          {!isOwnPost && (
            <Pressable
              className={[
                "pl-3 pr-3 py-2 rounded-full border flex-row items-center justify-center",
                isFollowed ? "border-success bg-success/10" : "border-primary bg-primary/5"
              ].join(" ")}
              disabled={isTogglingFollow}
              onPress={handleToggleFollow}
              style={({ pressed }) => [
                pressed && { opacity: 0.75, backgroundColor: isFollowed ? "#def2e1" : "#ede9fc" },
                { minWidth: 90 }
              ]}
            >
              {isTogglingFollow ?
                <ActivityIndicator size="small" color={isFollowed ? "#6cbf43" : "#2667c9"} className="mr-2" /> :
                isFollowed ?
                  <>
                    <Ionicons name="star" size={18} color="#6cbf43" className="mr-1" />
                    <Text className="text-success font-semibold">Following</Text>
                  </>
                  :
                  <>
                    <Ionicons name="person-add" size={18} color="#7c69dc" className="mr-1" />
                    <Text className="text-primary font-semibold">Follow</Text>
                  </>
              }
            </Pressable>
          )}
        </View>

        {/* Image (if present) */}
        {imgUrl && (
          <>
            <Pressable onPress={() => setModalVisible(true)} className="mb-3">
              <View className="rounded-xl overflow-hidden border border-tint-3 bg-tint-3/10">
                <Image
                  source={{ uri: imgUrl }}
                  style={{ width: screen.width - 44, height: 210, backgroundColor: '#e5e1f8' }}
                  contentFit="cover"
                />
              </View>
            </Pressable>
            {/* Modal for fullscreen image */}
            <Modal
              visible={modalVisible}
              animationType="fade"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/90">
                  <Image
                    source={{ uri: imgUrl }}
                    style={{ width: screen.width, height: screen.height * 0.7, borderRadius: 10, backgroundColor: "#18142e" }}
                    contentFit="contain"
                  />
                  <TouchableOpacity
                    className="absolute top-12 right-6 p-1 rounded-full"
                    onPress={() => setModalVisible(false)}
                    accessibilityLabel="Close Image"
                  >
                    <Ionicons name="close-circle" size={44} color="#e0e7fa" />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </>
        )}

        {/* Post Content */}
        {post.text && (
          <View className="bg-tint-3/15 px-4 py-3 rounded-xl my-2 border border-tint-3 min-h-[36px]">
            <Text className="font-semibold text-base leading-[22px] text-text-primary dark:text-dark-text-primary">
              {post.text}
            </Text>
          </View>
        )}

        {/* Controls: Like, Comment, Share */}
        <View className="mt-3 flex-row items-center justify-between gap-x-3">
          {/* Like Button */}
          <Pressable
            className={[
              "flex-row px-2 p-1 items-center rounded-full border",
              liked
                ? "border-error bg-error/10"
                : "border-primary bg-primary/5",
            ].join(" ")}
            style={({ pressed }) => [
              pressed && {
                opacity: 0.8,
                backgroundColor: liked
                  ? "#fbe4ee"
                  : "#ede9fc",
              },
              {
                paddingVertical: 11,
                paddingHorizontal: 18,
                minWidth: 92,
              },
            ]}
            onPress={toggleLike}
            disabled={likeLoading}
            accessibilityLabel={liked ? "Unlike" : "Like"}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#DC2626" : "#2F6FED"}
              className="mr-2"
              style={{
                marginRight: 8,
                transform: [{ scale: liked ? 1.13 : 1 }],
              }}
            />
            <Text
              className={[
                "mr-2 text-base tracking-wide",
                liked
                  ? "text-error dark:text-dark-error font-bold"
                  : "text-primary dark:text-dark-primary font-medium",
              ].join(" ")}
            >
              {liked ? "Liked" : "Like"}
            </Text>
            <Text
              className="text-sm mr-1 text-text-secondary dark:text-dark-text-secondary"
              style={{ minWidth: 28 }}
            >
              {likesCount || post.likesCount}
            </Text>
            {likeLoading && (
              <ActivityIndicator
                size="small"
                color={liked ? "#DC2626" : "#2F6FED"}
                style={{ marginLeft: 5 }}
              />
            )}
          </Pressable>

          {/* Comment Button (opens upcoming modal) */}
          <Pressable
            className="flex-row p-2 px-3 items-center rounded-full border border-border dark:border-dark-border bg-surface/50 dark:bg-dark-surface/50"
            style={({ pressed }) => [
              pressed && { opacity: 0.8 },
              { paddingVertical: 11, paddingHorizontal: 14, minWidth: 75 }
            ]}
            onPress={() => setUpcomingModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={20}
              color="#2F6FED"
              className="mr-2"
            />
            <Text className="text-sm font-semibold text-primary dark:text-dark-primary">
              Comment
            </Text>
          </Pressable>

          {/* Share (also upcoming modal) */}
          <Pressable
            className="flex-row p-2 px-3 justify-center items-center rounded-full border border-accent bg-accent/10"
            style={({ pressed }) => [
              pressed && { opacity: 0.88 },
              { paddingVertical: 11, paddingHorizontal: 14, minWidth: 72 }
            ]}
            onPress={() => setUpcomingModalVisible(true)}
          >
            <Ionicons
              name="share-social-outline"
              size={19}
              color="#C9A24D"
              className="mr-2"
            />
            <Text className="text-sm font-semibold text-accent dark:text-dark-accent">
              Share
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Upcoming Modal */}
      <Modal
        visible={upcomingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUpcomingModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-surface dark:bg-dark-surface rounded-3xl py-10 px-6 w-full max-w-xs items-center shadow-lg">
            <Ionicons name="sparkles-outline" size={42} color="#885cf5" className="mb-2" />
            <Text className="text-lg font-bold text-primary mb-2 text-center">
              {upcomingModalContent[0].title}
            </Text>
            <Text className="text-base font-medium text-primary/70 mb-5 text-center">
              {upcomingModalContent[0].subtitle}
            </Text>
            <ScrollView className="max-h-52 w-full self-center mb-3">
              {upcomingModalContent[0].points.map(pt => (
                <View key={pt} className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={20} color="#945ef5" className="mr-3" />
                  <Text className="text-base font-semibold text-text-primary">{pt}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="mt-5 bg-primary/10 rounded-full py-3 px-10 self-center shadow"
              onPress={() => setUpcomingModalVisible(false)}
              activeOpacity={0.89}
            >
              <Text className="text-base font-bold tracking-wider text-primary">Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
