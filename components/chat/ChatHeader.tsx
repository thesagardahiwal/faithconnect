import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function ChatHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-4 py-3 border-b border-border dark:border-dark-border">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" color={"#E8F0FE"} size={24} />
      </Pressable>
      <Text className="ml-3 dark:text-primary-soft text-dark-primary-soft text-lg font-semibold">{title}</Text>
    </View>
  );
}
