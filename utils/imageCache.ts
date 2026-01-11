import { Directory, File, Paths } from 'expo-file-system';

/**
 * Cache directory: <app-cache>/images
 */
export const imagesDir = new Directory(Paths.cache, 'images');

/**
 * Ensure cache directory exists
 */
export async function ensureImagesDir() {
    if (!imagesDir.exists) {
        await imagesDir.create({ intermediates: true });
    }
}

/**
 * Get local cached image file (if exists)
 */
export function getCachedImageFile(fileId: string): File {
    // We assume jpg for simplicity, but could be dependent on actual file
    return new File(imagesDir, `${fileId}.jpg`);
}

/**
 * Download and cache image
 */
export async function cacheImage(
    remoteUrl: string,
    fileId: string
): Promise<File> {
    await ensureImagesDir();

    const file = getCachedImageFile(fileId);

    if (file.exists) {
        return file; // ✅ already cached
    }

    await File.downloadFileAsync(remoteUrl, file);
    return file;
}
