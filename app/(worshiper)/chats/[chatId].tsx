import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import Screen from '@/components/common/Screen';
import { useChat } from '@/hooks/useChat';
import { useUser } from '@/hooks/useUser';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FlatList } from 'react-native';

export default function ChatScreen() {
  const { chatId, profileId } = useLocalSearchParams<{ chatId: string, profileId: string }>();
  const { profile } = useUser();
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
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            isMine={item.sender === profile?.$id}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      <MessageInput onSend={sendMessage} disabled={sending} />
    </Screen>
  );
}
