import { Directory, File, Paths } from 'expo-file-system';

/**
 * Cache directory: <app-cache>/reels
 */
export const reelsDir = new Directory(Paths.cache, 'reels');

/**
 * Ensure cache directory exists
 */
export async function ensureReelsDir() {
  if (!reelsDir.exists) {
    await reelsDir.create({ intermediates: true });
  }
}

/**
 * Get local cached reel file (if exists)
 */
export function getCachedReelFile(fileId: string): File {
  return new File(reelsDir, `${fileId}.mp4`);
}

/**
 * Download and cache reel
 */
export async function cacheReel(
  remoteUrl: string,
  fileId: string
): Promise<File> {
  await ensureReelsDir();

  const file = getCachedReelFile(fileId);

  if (file.exists) {
    return file; // ✅ already cached
  }

  await File.downloadFileAsync(remoteUrl, file);
  return file;
}
