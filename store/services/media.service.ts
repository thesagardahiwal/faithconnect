import { APPWRITE_CONFIG } from '@/config/appwrite';
import { storage } from '@/lib/appwrite';
import { ID } from 'react-native-appwrite';

export type MediaType = 'image' | 'video';

export const uploadMedia = async (
  file: any,
  type: MediaType
) => {
  try {
    const bucketId =
      type === 'image'
        ? APPWRITE_CONFIG.buckets.postMedia
        : APPWRITE_CONFIG.buckets.reelsMedia;

    const uploaded = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );

    return uploaded.$id;
  } catch (error) {
    let message = 'Failed to upload media.';
    if (error && typeof error === 'object' && 'message' in error) {
      message = (error as { message?: string }).message || message;
    }
    console.error('uploadMedia error:', error);
    throw new Error(message);
  }
};

export const getMediaUrl = (
  fileId: string,
  type: MediaType
) => {
  const bucketId =
    type === 'image'
      ? APPWRITE_CONFIG.buckets.postMedia
      : APPWRITE_CONFIG.buckets.reelsMedia;

  // Use getFileViewURL for videos to ensure proper playback
  if (type === 'video') {
    return storage.getFileViewURL(bucketId, fileId);
  }
  return storage.getFilePreviewURL(bucketId, fileId);
};
