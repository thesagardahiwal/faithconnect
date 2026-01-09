import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useChats } from '@/hooks/useChats';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text } from 'react-native';

export default function ChatsList() {
  const { chats } = useChats();
  const router = useRouter();

  return (
    <Screen>
      <Header title="Chats" />

      <FlatList
        data={chats}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Pressable
            className="py-3 border-b border-border dark:border-dark-border"
            onPress={() => router.push(`/(leader)/chats/${item.$id}`)}
          >
            <Text className="text-text-primary dark:text-dark-text-primary">
              Conversation
            </Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}
