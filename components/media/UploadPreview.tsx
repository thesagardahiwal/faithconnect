import { VideoView, useVideoPlayer } from 'expo-video';
import { Image, View } from 'react-native';

function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View className="mt-3 rounded-xl overflow-hidden bg-black">
      <VideoView
        player={player}
        className="h-64 w-full"
        contentFit="contain"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
    </View>
  );
}

export function UploadPreview({ asset }: { asset: any }) {
  if (!asset) return null;

  // Check if it's a video by mime type or file extension
  const isVideo = asset.type?.startsWith('video/') || 
                  asset.mimeType?.startsWith('video/') ||
                  asset.uri?.includes('.mp4') ||
                  asset.uri?.includes('.mov') ||
                  asset.uri?.includes('.avi');

  if (isVideo) {
    return <VideoPreview uri={asset.uri} />;
  }

  return (
    <View className="mt-3">
      <Image
        source={{ uri: asset.uri }}
        className="h-48 w-full rounded-xl"
      />
    </View>
  );
}
