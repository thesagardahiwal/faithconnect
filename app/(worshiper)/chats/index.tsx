import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useChats } from '@/hooks/useChats';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text } from 'react-native';

export default function WorshiperChats() {
  const { chats } = useChats();
  const router = useRouter();

  return (
    <Screen>
      <Header title="Chats" />

      <FlatList
        data={chats}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/(worshiper)/chats/${item.$id}`)}>
            <Text>{item.lastMessage || 'Conversation'}</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}
