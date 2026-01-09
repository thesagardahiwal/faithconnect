import { FlatList, Text, View } from 'react-native';
import ReelGridItem from './ReelGridItem';

interface LeaderReelsGridProps {
  reels: any[];
}

export default function LeaderReelsGrid({ reels }: LeaderReelsGridProps) {
  if (!reels || reels.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-text-secondary dark:text-dark-text-secondary">
          No reels yet
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className='mt-6'
      data={reels}
      numColumns={2}
      keyExtractor={(item) => item.$id}
      columnWrapperStyle={{ gap: 8, paddingHorizontal: 8 }}
      contentContainerStyle={{ paddingBottom: 24 }}
      renderItem={({ item }) => <ReelGridItem reel={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
