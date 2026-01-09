import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { MediaPicker } from '@/components/media/MediaPicker';
import { UploadPreview } from '@/components/media/UploadPreview';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useMedia } from '@/hooks/useMedia';
import { databases } from '@/lib/appwrite';
import { ID } from 'react-native-appwrite';
import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';

export default function CreateReel() {
  const router = useRouter();
  const { profile } = useUser();
  const { pickVideo, upload } = useMedia();

  const [text, setText] = useState('');
  const [videoAsset, setVideoAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePickVideo = async () => {
    const asset = await pickVideo();
    if (asset) {
      setVideoAsset(asset);
    }
  };

  const handlePublish = async () => {
    if (!videoAsset) {
      Alert.alert('Video required', 'Please select a video to create a reel.');
      return;
    }

    if (!profile) {
      Alert.alert('Not signed in', 'Please sign in to publish a reel.');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload video
      const mediaFileId = await upload(videoAsset, 'video');

      // 2️⃣ Create reel document
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.posts,
        ID.unique(),
        {
          leader: profile.$id,
          type: 'reel',
          text: text || undefined,
          mediaUrl: mediaFileId,
          likesCount: 0,
          commentsCount: 0,
        }
      );

      // 3️⃣ Reset state
      setText('');
      setVideoAsset(null);

      // 4️⃣ Navigate back
      router.back();
      
      Alert.alert('Success', 'Reel published successfully!');
    } catch (error: any) {
      console.error('Error creating reel:', error);
      Alert.alert('Error', error?.message || 'Failed to publish reel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Header title="New Reel" />

        {/* Text input */}
        <View className="mb-4">
          <AppInput
            label="Caption (optional)"
            value={text}
            onChangeText={setText}
            placeholder="Add a caption to your reel..."
          />
        </View>

        {/* Video picker */}
        <View className="mb-4">
          <MediaPicker
            label={videoAsset ? "Change Video" : "Select Video"}
            onPick={handlePickVideo}
          />
        </View>

        {/* Video Preview */}
        {videoAsset && (
          <View className="mb-4">
            <UploadPreview asset={videoAsset} />
            <View className="mt-2 flex-row items-center bg-surface dark:bg-dark-surface p-3 rounded-xl border border-border dark:border-dark-border">
              <Ionicons name="videocam" size={20} color="#2667c9" style={{ marginRight: 8 }} />
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                  {videoAsset.fileName || videoAsset.name || 'Video selected'}
                </Text>
                {videoAsset.duration && (
                  <Text className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                    Duration: {Math.round(videoAsset.duration)}s
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Info message */}
        {!videoAsset && (
          <View className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#2667c9" style={{ marginRight: 8, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-1">
                  Create a Reel
                </Text>
                <Text className="text-xs text-blue-700 dark:text-blue-300">
                  Select a video from your gallery to create an engaging reel. You can add an optional caption to describe your content.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Publish */}
        <View className="mb-6">
          <AppButton
            title={loading ? 'Publishing Reel...' : 'Publish Reel'}
            loading={loading}
            onPress={handlePublish}
            disabled={!videoAsset || loading}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
