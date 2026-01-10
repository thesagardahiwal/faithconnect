import { getMediaUrl } from '@/store/services/media.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
// import { useRouter } from 'expo-router';
import { Dimensions, Pressable, View } from 'react-native';

const { width } = Dimensions.get('window');
const GAP = 8;
const ITEM_WIDTH = (width - GAP * 3) / 2;
const ITEM_HEIGHT = ITEM_WIDTH * (16 / 9);

interface ReelGridItemProps {
  reel: any;
}

export default function ReelGridItem({ reel }: ReelGridItemProps) {
  // const router = useRouter();

  // Appwrite video preview frame (works as thumbnail)
  const thumbnailUrl = reel.mediaUrl
    ? getMediaUrl(reel.mediaUrl, 'video') + '&mode=poster'
    : null;

  return (
    <Pressable
    //   onPress={() =>
    //     router.push({
    //       pathname: '/reels/view',
    //       params: { reelId: reel.$id },
    //     })
    //   }
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {thumbnailUrl ? (
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="videocam" size={24} color="#fff" />
        </View>
      )}

      {/* Play icon overlay */}
      <View className="absolute inset-0 items-center justify-center">
        <Ionicons
          name="play-circle"
          size={36}
          color="rgba(255,255,255,0.9)"
        />
      </View>
    </Pressable>
  );
}
