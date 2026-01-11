import { CommentInput } from '@/components/comment/CommentInput';
import { CommentItem } from '@/components/comment/CommentItem';
import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import PostCard from '@/components/post/PostCard';
import { useComments } from '@/hooks/useComments';
import { useUser } from '@/hooks/useUser';
import { useLocalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';

export default function CommentsScreen() {
    const { id: postId } = useLocalSearchParams<{ id: string }>();
    const { profile } = useUser();
    const { post, comments, addComment } = useComments(postId!);

    return (
        <Screen>
            <Header title="Comments" />
            <FlatList
                data={comments}
                keyExtractor={(item) => item.$id}
                ListHeaderComponent={() => (
                    <>
                        {post && <PostCard post={post} hideCommentButton={true} />}
                    </>
                )}
                renderItem={({ item }) => <CommentItem comment={item} />}
                contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
            />

            <CommentInput
                onSend={(text) => {
                    if (!profile) return;
                    addComment(profile.$id, text);
                }}
            />
        </Screen>
    );
}
