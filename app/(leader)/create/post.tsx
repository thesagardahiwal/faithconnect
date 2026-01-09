import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { MediaPicker } from '@/components/media/MediaPicker';
import { UploadPreview } from '@/components/media/UploadPreview';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { useMedia } from '@/hooks/useMedia';
import { databases } from '@/lib/appwrite';
import { ID } from "react-native-appwrite";

import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useUser } from '@/hooks/useUser';

export default function CreatePost() {
  const router = useRouter();
  const { profile } = useUser();
  const { pickImage, upload } = useMedia();

  const [text, setText] = useState('');
  const [imageAsset, setImageAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const asset = await pickImage();
    if (asset) {
      setImageAsset(asset);
    }
  };

  const handlePublish = async () => {
    if (!text && !imageAsset) {
      Alert.alert('Post is empty', 'Please add text or an image.');
      return;
    };

    if (!profile) {
        Alert.alert('Not signed in', 'Please sign in to publish a post.');
        return;
    }

    try {
      setLoading(true);

      let mediaFileId: string | null = null;

      // 1️⃣ Upload image if selected
      if (imageAsset) {
        mediaFileId = await upload(imageAsset, 'image');
      }

      // 2️⃣ Create post document
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.posts,
        ID.unique(),
        {
          leader: profile.$id,
          type: 'post',
          text: text || '',
          mediaUrl: mediaFileId, // can be null
          likesCount: 0,
          commentsCount: 0,
        }
      );

      // 3️⃣ Reset state
      setText('');
      setImageAsset(null);

      // 4️⃣ Navigate back
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="New Post" />

      {/* Text input */}
      <AppInput
        label="Message"
        value={text}
        onChangeText={setText}
      />

      {/* Image picker */}
      <MediaPicker
        label="Add Image (optional)"
        onPick={handlePickImage}
      />

      {/* Preview */}
      <UploadPreview asset={imageAsset} />

      {/* Publish */}
      <AppButton
        title={loading ? 'Publishing...' : 'Publish Post'}
        loading={loading}
        onPress={handlePublish}
      />
    </Screen>
  );
}
