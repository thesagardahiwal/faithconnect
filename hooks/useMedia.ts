import { MediaType, uploadMedia } from '@/store/services/media.service';
import * as ImagePicker from 'expo-image-picker';

export const useMedia = () => {
  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true
      });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };

  const pickVideo = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: true
      });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };

  const upload = async (
    asset: any,
    type: MediaType
  ) => {
    if (!asset || !asset.uri) {
      throw new Error('No valid asset provided for upload.');
    }

    // Fallbacks for asset fields, supporting platform differences (expo vs react-native-image-picker, etc)
    const inferredMime = type === 'image' ? 'image/jpeg' : 'video/mp4';
    const inferredExt = type === 'image' ? 'jpg' : 'mp4';

    const file = {
      ...asset,
      uri: asset.uri,
      name: asset.fileName || asset.name || `upload.${inferredExt}`,
      type: asset.mimeType || asset.type || inferredMime,
      size: asset.fileSize || asset.size || undefined,
    };

    try {
      return await uploadMedia(file, type);
    } catch (err) {
      // Optional: You can enhance error display/handling here if needed
      console.error('Failed to upload media asset:', err);
      throw err;
    }
  };

  return {
    pickImage,
    pickVideo,
    upload,
  };
};
