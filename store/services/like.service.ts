import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { ID, Query } from "react-native-appwrite";

const DATABASE_ID = APPWRITE_CONFIG.databaseId;
const LIKES_COLLECTION_ID = APPWRITE_CONFIG.collections.likes;
const POSTS_COLLECTION_ID = APPWRITE_CONFIG.collections.posts;

/**
 * Check if user has already liked a post
 */
export const checkIsLiked = async (
  userId: string,
  postId: string
) => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    LIKES_COLLECTION_ID,
    [
      Query.equal('user', userId),
      Query.equal('post', postId),
    ]
  );

  return res.documents.length > 0 ? res.documents[0] : null;
};

/**
 * Like a post
 */
export const likePost = async (
  userId: string,
  postId: string
) => {
  // 1️⃣ Prevent duplicate likes
  const existing = await checkIsLiked(userId, postId);
  if (existing) {
    return existing;
  }

  // --- We need to make sure #2 and #3 both succeed, otherwise revert

  let likeDoc;
  try {
    // 2️⃣ Create like document
    likeDoc = await databases.createDocument(
      DATABASE_ID,
      LIKES_COLLECTION_ID,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    // 3️⃣ Increment likesCount on post
    await databases.incrementDocumentAttribute(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      postId,
      'likesCount',
      1
    );
  } catch (err) {
    // If we created a likeDoc but failed to increment, delete the like doc to revert
    if (likeDoc && likeDoc.$id) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          LIKES_COLLECTION_ID,
          likeDoc.$id
        );
      } catch (deleteError) {
        // Log the error but still re-throw the original
        console.error('Rollback failed: could not delete like document after failed increment', deleteError);
      }
    }
    throw err;
  }

  return likeDoc;
};

/**
 * Unlike a post
 */
export const unlikePost = async (
  likeId: string,
  postId: string
) => {
  // --- We need to make sure #1 and #2 both succeed, otherwise revert

  let likeDocBackup;
  try {
    // Read the like document so we can recreate if needed on failure
    likeDocBackup = await databases.getDocument(
      DATABASE_ID,
      LIKES_COLLECTION_ID,
      likeId
    );

    // 1️⃣ Delete like document
    await databases.deleteDocument(
      DATABASE_ID,
      LIKES_COLLECTION_ID,
      likeId
    );

    // 2️⃣ Decrement likesCount on post
    await databases.decrementDocumentAttribute(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      postId,
      'likesCount',
      1
    );
  } catch (err) {
    // If like doc was deleted but decrement failed, attempt to recreate the like doc for consistency
    if (likeDocBackup) {
      try {
        // Try to recreate with same $id and attributes
        await databases.createDocument(
          DATABASE_ID,
          LIKES_COLLECTION_ID,
          likeDocBackup.$id,
          {
            user: likeDocBackup.user,
            post: likeDocBackup.post
          }
        );
      } catch (recreateLikeError) {
        // Log error but do not swallow the original error
        console.error('Rollback failed: could not restore like document after failed decrement', recreateLikeError);
      }
    }
    throw err;
  }
};

/**
 * Get likes for a post (optional, for future use)
 */
export const getPostLikes = async (postId: string) => {
  return databases.listDocuments(
    DATABASE_ID,
    LIKES_COLLECTION_ID,
    [Query.equal('post', postId)]
  );
};
