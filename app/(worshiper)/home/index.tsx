import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import PostCard from '@/components/post/PostCard';
import { useFollows } from '@/hooks/useFollows';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable } from 'react-native';

export default function WorshiperHome() {
  const router = useRouter();
  const { explore, loadExplore } = usePosts();
  const { profile } = useUser();
  const { loadMyLeaders } = useFollows()

  useEffect(() => {
    loadExplore();
  }, [loadExplore]);

  useEffect(() => {
    if (profile) {
        loadMyLeaders(profile.$id);
    };
  }, [loadMyLeaders, profile]);

  return (
    <Screen>
      <Header 
        title="Explore" 
        right={
          <Pressable onPress={() => router.push('/(worshiper)/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#2667c9" />
          </Pressable>
        }
      />

      <FlatList
        data={explore}
        keyExtractor={(item) => item.$id}
        onRefresh={loadExplore}
        refreshing={false}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </Screen>
  );
}
