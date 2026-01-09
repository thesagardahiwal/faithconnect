import { getMediaUrl } from '@/store/services/media.service';
import { useEvent } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Button, StyleSheet, View } from 'react-native';

export function VideoViewer({
  fileId,
}: {
  fileId: string;
}) {
  const videoUrl = getMediaUrl(fileId, 'video');
  const uri = videoUrl ? (typeof videoUrl === 'string' ? videoUrl : String(videoUrl)) : '';
  const player = useVideoPlayer(uri || 'about:blank', player => {
    if (uri) {
      player.loop = true;
      player.play();
    }
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={styles.contentContainer}>
        <VideoView
          player={player}
          className="w-full h-80 rounded-xl"
          allowsFullscreen allowsPictureInPicture
          contentFit='contain'
        />
        <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
    },
    video: {
      width: 350,
      height: 275,
    },
    controlsContainer: {
      padding: 10,
    },
  });