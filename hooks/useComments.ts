import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { notificationService } from '@/store/services/notification.service';
import { fetchPostById } from '@/store/services/post.service';
import { addCommentOptimistic, addPostComment, setCurrentPost } from '@/store/slices/post.slice';
import { useEffect, useState } from 'react';
import { ID } from 'react-native-appwrite';

export function useComments(postId: string) {
    const dispatch = useAppDispatch();

    // Select current post from Redux
    const post = useAppSelector(state => state.posts.currentPost);
    const comments = post?.comments || [];

    const [loading, setLoading] = useState(false);

    const loadPost = async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const res = await fetchPostById(postId);
            dispatch(setCurrentPost(res as any));
        } catch (error) {
            console.error("Failed to load post:", error);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (userId: string, text: string) => {
        if (!text.trim()) return;

        // Create optimistic comment
        const tempId = ID.unique();
        const optimisticComment = {
            $id: tempId,
            text,
            author: { $id: userId, name: 'You', photoUrl: null }, // Simple placeholder
            $createdAt: new Date().toISOString(),
        };

        try {
            // 1. Optimistic Update
            dispatch(addCommentOptimistic({ postId, comment: optimisticComment }));

            // 2. Background API Call
            await dispatch(addPostComment({ postId, userId, text })).unwrap();

            // 3. Notification
            if (post?.leader) {
                const leaderId = typeof post.leader === 'string' ? post.leader : post.leader.$id;
                if (leaderId !== userId) {
                    await notificationService.create({
                        to: leaderId,
                        from: userId,
                        type: 'comment',
                        post: postId,
                        text: 'commented on your post',
                    });
                }
            }

            // Note: The thunk could update the comment with real ID, specifically if we reload or match by temp ID.
            // For now simplest is we reload the post to get fresh state or rely on list view updates.
            // As improve we could replace the temp comment in state similar to likes.
            loadPost();

        } catch (error) {
            console.error("Failed to add comment:", error);
            // Rollback (could dispatch removeCommentOptimistic(tempId))
        }
    };

    useEffect(() => {
        loadPost();
        return () => {
            // Cleanup if needed, e.g. clear current post
            dispatch(setCurrentPost(null));
        }
    }, [postId]);

    return {
        post,
        comments,
        loading,
        addComment,
        reload: loadPost,
    };
}
