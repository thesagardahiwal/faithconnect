import { useAuth } from '@/hooks/useAuth';
import {
    checkIsLiked,
    likePost,
    unlikePost,
} from '@/store/services/like.service';
import { useEffect, useState } from 'react';

interface UseLikesParams {
  postId: string;
  initialLikesCount?: number;
}

export const useLikes = ({
  postId,
  initialLikesCount = 0,
}: UseLikesParams) => {
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  // 🔄 Check if current user already liked the post
  useEffect(() => {
    if (!user || !postId) return;

    const init = async () => {
      const existing = await checkIsLiked(user.$id, postId);
      if (existing) {
        setLiked(true);
        setLikeId(existing.$id);
      }
    };

    init();
  }, [user, postId]);

  // ❤️ Toggle like / unlike
  const toggleLike = async () => {
    if (!user || loading) return;

    try {
      setLoading(true);

      if (liked && likeId) {
        await unlikePost(likeId, postId);
        setLiked(false);
        setLikeId(null);
        setLikesCount((c) => Math.max(0, c - 1));
      } else {
        const newLike = await likePost(user.$id, postId);
        setLiked(true);
        setLikeId(newLike.$id);
        setLikesCount((c) => c + 1);
      }
    } catch (err) {
      console.error('Like toggle failed', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    likesCount,
    loading,
    toggleLike,
  };
};
