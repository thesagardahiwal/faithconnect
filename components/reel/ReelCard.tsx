import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useLikes } from '@/hooks/useLikes';
import { useUser } from '@/hooks/useUser';
import { storage } from '@/lib/appwrite';
import { getMediaUrl } from '@/store/services/media.service';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Dimensions, Pressable, Text, View } from 'react-native';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function getProfileImageUrl(imgId: string | undefined): string | null {
  if (!imgId) return null;
  try {
    return storage.getFileViewURL(APPWRITE_CONFIG.buckets.postMedia, imgId).toString();
  } catch {
    return null;
  }
}

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

function getLeaderName(leaderData: any): string {
  if (!leaderData) return 'Unknown';
  if (typeof leaderData === 'string') return 'Unknown';
  return leaderData.name ? leaderData.name : 'Unknown';
}

interface ReelCardProps {
  reel: any;
  isActive: boolean;
}

export default function ReelCard({ reel, isActive }: ReelCardProps) {
  const { profile } = useUser();
  const leaderData = reel.leader || {};
  const leaderName = getLeaderName(leaderData);
  const leaderImgId = leaderData?.photoUrl;
  
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);

  const videoUrl = reel.mediaUrl ? getMediaUrl(reel.mediaUrl, 'video') : null;
  let videoUri = '';
  if (videoUrl) {
    try {
      videoUri = typeof videoUrl === 'string' ? videoUrl : String(videoUrl);
    } catch {
      videoUri = '';
    }
  }
  
  const player = useVideoPlayer(videoUri || 'about:blank', (player) => {
    if (videoUri) {
      player.loop = true;
      player.muted = isMuted;
      playerRef.current = player;
    }
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  // Auto-play when active, pause when not
  useEffect(() => {
    if (!videoUri) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player, videoUri]);

  // Load profile image
  useEffect(() => {
    if (leaderImgId) {
      const url = getProfileImageUrl(leaderImgId);
      setProfileImgUrl(url);
      setImgFailed(false);
    }
  }, [leaderImgId]);

  const { liked, likesCount, toggleLike } = useLikes({
    postId: reel.$id,
    initialLikesCount: reel.likesCount || 0,
  });

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [isPlaying, player]);

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    player.muted = newMuted;
  }, [isMuted, player]);

  useFocusEffect(
    useCallback(() => {
      // Screen focused
      if (isActive && videoUri) {
        player.play();
      }
  
    }, [isActive, videoUri, player])
  );
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        player.pause();
      } else {
        // Resume only if reel is active
        if (isActive && videoUri) {
          player.play();
        }
      }
    });
  
    return () => {
      subscription.remove();
    };
  }, [player, isActive, videoUri]);
  
  if (!videoUri || videoUri === 'about:blank') {
    return (
      <View style={{ height: SCREEN_HEIGHT, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="videocam-off" size={48} color="#666" />
        <Text style={{ color: '#fff', marginTop: 12, fontSize: 14 }}>Video not available</Text>
      </View>
    );
  }

  return (
    <View style={{ height: SCREEN_HEIGHT - 100, backgroundColor: '#000' }}>
      {/* Video */}
      <Pressable
        onPress={handleTogglePlay}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <VideoView
          player={player}
          style={{
            width: '100%',
            height: '100%',
          }}
          contentFit="cover"
          allowsPictureInPicture={false}
          nativeControls={false}
        />
        
        {/* Play/Pause overlay */}
        {!isPlaying && (
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="play" size={32} color="white" />
            </View>
          </View>
        )}
      </Pressable>

      {/* Right side actions */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 100,
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Profile Image */}
        <Pressable>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: '#fff',
              overflow: 'hidden',
              backgroundColor: '#333',
            }}
          >
            {profileImgUrl && !imgFailed ? (
              <Image
                source={{ uri: profileImgUrl }}
                style={{ width: 48, height: 48 }}
                contentFit="cover"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
            )}
          </View>
        </Pressable>

        {/* Like Button */}
        <Pressable onPress={toggleLike} style={{ alignItems: 'center' }}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={32}
            color={liked ? '#FF3040' : '#fff'}
          />
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 4, fontWeight: '600' }}>
            {likesCount}
          </Text>
        </Pressable>

        {/* Mute/Unmute Button */}
        <Pressable onPress={handleToggleMute}>
          <Ionicons
            name={isMuted ? 'volume-mute' : 'volume-high'}
            size={28}
            color="#fff"
          />
        </Pressable>
      </View>

      {/* Bottom info with gradient overlay */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          paddingBottom: 40,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginRight: 8 }}>
            {leaderName}
          </Text>
          <Text style={{ color: '#fff', fontSize: 12, opacity: 0.8 }}>
            {timeAgo(reel.$createdAt)}
          </Text>
        </View>
        {reel.text && (
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              marginTop: 4,
              lineHeight: 20,
            }}
            numberOfLines={2}
          >
            {reel.text}
          </Text>
        )}
      </View>
    </View>
  );
}
