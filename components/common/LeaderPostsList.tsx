import EmptyState from '@/components/common/EmptyState';
import PostCard from '@/components/post/PostCard';
import { FlatList, View } from 'react-native';

interface PostsListProps {
  posts: any[];
}

export default function PostsList({ posts }: PostsListProps) {
  if (!posts || posts.length === 0) {
    return <EmptyState text="No posts yet" />;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <View className="px-4 mb-4">
          <PostCard post={item} />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={7}
    />
  );
}
