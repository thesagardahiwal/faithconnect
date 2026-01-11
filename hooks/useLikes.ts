import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { notificationService } from '@/store/services/notification.service';
import { toggleLikeOptimistic, togglePostLike } from '@/store/slices/post.slice';
import { useState } from 'react';

interface UseLikesParams {
  postId: string;
  initialLikesCount?: number;
}

export const useLikes = ({
  postId,
  initialLikesCount = 0,
}: UseLikesParams) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // Select post from store to get real-time likes
  // We check all lists where the post might exist
  const post = useAppSelector(state =>
    state.posts.explore.find(p => p.$id === postId) ||
    state.posts.reels.find(p => p.$id === postId) ||
    (state.posts.currentPost?.$id === postId ? state.posts.currentPost : null)
  );

  const liked = post?.likes?.some(l => l.user === user?.$id || (l.user as any)?.$id === user?.$id) ?? false;
  const likesCount = post?.likesCount ?? initialLikesCount;
  const likeId = post?.likes?.find(l => l.user === user?.$id || (l.user as any)?.$id === user?.$id)?.$id;

  const [loading, setLoading] = useState(false);

  // Toggle like / unlike
  const toggleLike = async () => {
    if (!user) return; // Don't block on loading for optimistic UI, but maybe for spam prevention?

    try {
      setLoading(true);

      // 1. Optimistic Update
      dispatch(toggleLikeOptimistic({ postId, userId: user.$id }));

      // 2. Background API Call
      await dispatch(togglePostLike({ postId, userId: user.$id, isLiked: liked, likeId })).unwrap();

      // 3. Notification (only on like)
      if (!liked && post?.leader) {
        // Check if post.leader is an object or string
        const leaderId = typeof post.leader === 'string' ? post.leader : post.leader.$id;

        if (leaderId !== user.$id) {
          await notificationService.create({
            to: leaderId,
            from: user.$id,
            type: 'like',
            post: postId,
            text: 'liked your post',
          });
        }
      }

    } catch (err) {
      console.error('Like toggle failed', err);
      // Rollback is handled in slice rejected case
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
