import { Text, View } from 'react-native';

export default function EmptyState({ text }: { text: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-text-secondary dark:text-dark-text-secondary">
        {text}
      </Text>
    </View>
  );
}
