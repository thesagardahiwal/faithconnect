import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import PostCard from '@/components/post/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function EmptyState({ loading, onReload }: { loading?: boolean, onReload: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="home-outline" size={60} color="#bdbdbd" style={{ marginBottom: 6 }} />
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptyDescription}>
        It looks like there are no posts to explore right now.
      </Text>
      {!loading && (
        <TouchableOpacity style={styles.reloadBtn} onPress={onReload} accessibilityLabel="Reload posts">
          <Ionicons name="refresh" size={20} color="#2667c9" style={{ marginRight: 5 }} />
          <Text style={styles.reloadText}>Reload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function LeaderHome() {
  const { explore, loadExplore, exploreLoading } = usePosts();
  const isFetchingMoreRef = useRef(false);

  // Improved load more to avoid double fetches
  const handleLoadMore = useCallback(() => {
    if (!isFetchingMoreRef.current && !exploreLoading) {
      isFetchingMoreRef.current = true;
      loadExplore();
      setTimeout(() => {
        isFetchingMoreRef.current = false;
      }, 600);
    }
  }, [exploreLoading, loadExplore]);

  return (
    <Screen>
      <Header title="Home" />
      <FlatList
        data={explore}
        keyExtractor={(item) => item.$id}
        onRefresh={loadExplore}
        refreshing={exploreLoading}
        renderItem={({ item }) => (
          <PostCard post={item} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={exploreLoading && explore.length > 0
          ? <Header title="Loading more..." />
          : null
        }
        ListEmptyComponent={
          exploreLoading
            ? null
            : <EmptyState loading={exploreLoading} onReload={loadExplore} />
        }
        contentContainerStyle={[
          { flexGrow: 1 },
          (!explore || explore.length === 0) && { justifyContent: 'center', flex: 1 }
        ]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 72,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 6,
    color: '#323357',
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#757B8A',
    textAlign: 'center',
    marginBottom: 18,
  },
  reloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2667c9',
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#f6fafd',
  },
  reloadText: {
    fontSize: 16,
    color: '#2667c9',
    fontWeight: '600'
  }
});