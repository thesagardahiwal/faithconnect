import Screen from "@/components/common/Screen";
import PostCard from "@/components/post/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types/post.types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

export default function PostDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPostById } = usePosts();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced fetchPost includes error/empty handling
  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPostById(id);
      if (response) {
        setPost(response as unknown as Post);
      } else {
        setPost(null);
        setError("Post not found.");
      }
    } catch {
      setPost(null);
      setError("An error occurred loading this post.");
    }
    setLoading(false);
  }, [id, getPostById]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPost();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7c69dc" />
          <Text className="mt-3 text-base text-tint-3">Loading post…</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="alert-circle-outline" size={44} color="#d97706" />
          <Text className="text-xl font-semibold mt-4 text-text-primary dark:text-dark-text-primary text-center">{error}</Text>
          <Pressable
            className="mt-6 px-8 py-3 rounded-full bg-primary/10 border border-primary"
            onPress={fetchPost}
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          >
            <Text className="text-primary font-bold text-base">Retry</Text>
          </Pressable>
          <Pressable
            className="mt-3 px-8 py-3 rounded-full bg-tint-3/20 border border-tint-3"
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.68 : 1 }]}
          >
            <Text className="text-tint-4 font-semibold text-base">Back</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // Allow swipe-to-refresh, and don't pass undefined post
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7c69dc"
            colors={["#7c69dc"]}
          />
        }
      >
        {post ? (
          <PostCard post={post} />
        ) : (
          <View className="flex-1 justify-center items-center mt-24">
            <Ionicons name="chatbubbles-outline" size={46} color="#b8bcd6" />
            <Text className="text-lg font-semibold mt-2 text-text-secondary dark:text-dark-text-secondary">No post found.</Text>
            <Pressable
              className="mt-4 px-7 py-3 rounded-full bg-primary/10 border border-primary"
              onPress={fetchPost}
              style={({ pressed }) => [{ opacity: pressed ? 0.77 : 1 }]}
            >
              <Text className="text-primary font-bold text-base">Retry</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}