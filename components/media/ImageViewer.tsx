import { getMediaUrl } from '@/store/services/media.service';
import { Image } from "expo-image";

export function ImageViewer({
  fileId,
}: {
  fileId: string;
}) {
  const uri = getMediaUrl(fileId, 'image');

  return (
    <Image
      source={uri.toString()}
      className="w-full h-64 rounded-xl"
      resizeMode="cover"
    />
  );
}
