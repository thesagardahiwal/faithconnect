import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useLikes } from '@/hooks/useLikes';
import { storage } from '@/lib/appwrite';
import { getMediaUrl } from '@/store/services/media.service';
import { cacheReel } from '@/utils/reelCache';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Dimensions, Pressable, Text, View } from 'react-native';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReelCardProps {
  reel: any;
  isActive: boolean;
  onPress?: () => void;
}

/* ---------------- helpers ---------------- */

function getProfileImageUrl(imgId?: string): string | null {
  if (!imgId) return null;
  try {
    return storage
      .getFileViewURL(APPWRITE_CONFIG.buckets.postMedia, imgId)
      .toString();
  } catch {
    return null;
  }
}

function timeAgo(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const seconds = (Date.now() - date.getTime()) / 1000;
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/* ---------------- component ---------------- */

export default function ReelCard({ reel, isActive, onPress }: ReelCardProps) {
  /* 🔒 hooks MUST be unconditional */
  const [videoUri, setVideoUri] = useState<string>('');
  // const videoUri =
  //   reel?.mediaUrl ? String(getMediaUrl(reel.mediaUrl, 'video')) : '';
  const player = useVideoPlayer(videoUri || 'about:blank', (p) => {
    p.loop = true;
    p.muted = false;
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  const tabBarHeight = useBottomTabBarHeight();

  const { liked, likesCount, toggleLike } = useLikes({
    postId: reel?.$id,
    initialLikesCount: reel?.likesCount ?? 0,
  });

  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const leader = typeof reel?.leader === 'object' ? reel.leader : null;

  /* ---------------- effects ---------------- */
  useEffect(() => {
    let cancelled = false;
  
    async function loadReel() {
      if (!reel?.mediaUrl) return;
  
      const remoteUrl = String(getMediaUrl(reel.mediaUrl, 'video'));
      const file = await cacheReel(remoteUrl, reel.mediaUrl);
  
      if (!cancelled) {
        setVideoUri(file.uri); // 👈 LOCAL FILE URI
      }
    }
  
    loadReel();
  
    return () => {
      cancelled = true;
    };
  }, [reel?.mediaUrl]);
  // Play / pause based on visibility
  // Optimized effect handling and added error handling
  useEffect(() => {
    if (!videoUri) return;
    try {
      if (isActive) {
        player.play();
      } else {
        player.pause();
      }
    } catch (error) {
      console.error("Video play/pause error:", error);
    }
    // Only depend on isActive or videoUri, not player object (player is stable from the hook)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, videoUri]);

  // Pause on navigation blur/focus with error handling
  useFocusEffect(
    useCallback(() => {
      try {
        if (isActive) player.play();
      } catch (error) {
        console.error("Video play error on focus:", error);
      }
      return () => {
        try {
          player.pause();
        } catch (error) {
          console.error("Video pause error on blur:", error);
        }
      };
    }, [isActive, player])
  );

  // Handle app foreground/background to control video playback
  useEffect(() => {
    const handleAppStateChange = (state: string) => {
      if (state === 'active' && isActive) {
        player.play();
      } else {
        player.pause();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [player, isActive]);

  // Efficiently set and clean up leader profile image
  useEffect(() => {
    if (leader?.photoUrl) {
      setProfileImgUrl(getProfileImageUrl(leader.photoUrl));
    } else {
      setProfileImgUrl(null);
    }
  }, [leader?.photoUrl]);

  /* ---------------- guards ---------------- */

  if (!videoUri) {
    return (
      <View
        style={{
          height: SCREEN_HEIGHT ,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="videocam-off" size={48} color="#666" />
        <Text style={{ color: '#fff', marginTop: 12 }}>
          Video not available
        </Text>
      </View>
    );
  }

  /* ---------------- render ---------------- */

  return (
    <View style={{ 
      backgroundColor: '#000', 
      height: SCREEN_HEIGHT - 30,
      paddingBottom: tabBarHeight,
      }}>
      {/* Video */}
      <Pressable
        onPress={() => (isPlaying ? player.pause() : player.play())}
        style={{ flex: 1 }}
      >
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%', borderRadius: 10 }}
          contentFit="cover"
          nativeControls={false}
        />

        {!isPlaying && (
          <View className="absolute inset-0 items-center justify-center">
            <Ionicons name="play-circle" size={64} color="white" />
          </View>
        )}
      </Pressable>

      {/* Right actions */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 3 * tabBarHeight,
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Avatar */}
        <View className="w-12 h-12 items-center justify-center rounded-full border-2 border-white overflow-hidden bg-gray-800">
          {profileImgUrl ? (
            <Image
              source={{ uri: profileImgUrl }}
              style={{ width: 48, height: 48 }}
            />
          ) : (
            <Ionicons name="person" size={24} color="white" />
          )}
        </View>

        {/* Like */}
        <Pressable onPress={toggleLike} className="items-center">
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={32}
            color={liked ? '#ff3040' : 'white'}
          />
          <Text className="text-white text-xs mt-1">{likesCount}</Text>
        </Pressable>

        {/* Mute */}
        <Pressable
          onPress={() => {
            player.muted = !isMuted;
            setIsMuted(!isMuted);
          }}
        >
          <Ionicons
            name={isMuted ? 'volume-mute' : 'volume-high'}
            size={28}
            color="white"
          />
        </Pressable>
      </View>

      {/* Bottom info */}
      <View style={{
        position: 'absolute',
        bottom: tabBarHeight,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}>
        <Pressable onPress={() => onPress?.()}>
          <Text className="text-white font-semibold">
            {leader?.name ?? 'Unknown'}
          </Text>
        </Pressable>
        <Text className="text-white/80 text-xs">
          {timeAgo(reel?.$createdAt)}
        </Text>
        {!!reel?.text && (
          <Text className="text-white mt-1" numberOfLines={2}>
            {reel.text}
          </Text>
        )}
      </View>
    </View>
  );
}
