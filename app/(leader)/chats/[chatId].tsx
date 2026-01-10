import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import Screen from '@/components/common/Screen';
import { useChat } from '@/hooks/useChat';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FlatList } from 'react-native';

export default function ChatScreen() {
  const { chatId, profileId } = useLocalSearchParams<{ chatId: string, profileId: string }>();
  const { messages, sendMessage, sending, loadMessages } = useChat(
    chatId!,
    profileId!
  );
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  

  return (
    <Screen>
      <ChatHeader title="Chat" />

      <FlatList
        data={messages}
        onRefresh={loadMessages}
        refreshing={false}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            isMine={item.sender === profileId}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      <MessageInput onSend={sendMessage} disabled={sending} />
    </Screen>
  );
}
