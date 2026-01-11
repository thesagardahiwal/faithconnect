import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import Screen from '@/components/common/Screen';
import { useChat } from '@/hooks/useChat';
import { useUser } from '@/hooks/useUser';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

export default function ChatScreen() {
  const { chatId, profileId } = useLocalSearchParams<{ chatId: string; profileId: string }>();
  const { profile } = useUser();
  const { messages, sendMessage, sending, loadMessages } = useChat(
    chatId!,
    profileId!
  );

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Extra: Find the next "upcoming" message (faked by first message with a special text for demo).
  const upcoming = useMemo(() => {
    return messages.find((msg) =>
      typeof msg.text === 'string' &&
      msg.text.toLowerCase().includes('upcoming')
    );
  }, [messages]);

  return (
    <Screen>
      <ChatHeader title="Chat" />

      {/* If there is an upcoming message, highlight it visually above the chat */}
      {upcoming && (
        <View className="mx-4 mt-3 mb-1 flex-row items-center rounded-full bg-accent/10 border border-accent px-3 py-1">
          {/* A nice icon for Upcoming */}
          <Text className="text-accent font-bold mr-2 text-xs">⏰</Text>
          <Text className="font-medium text-accent text-xs mr-1">Upcoming</Text>
          <Text
            className="text-xs text-text-secondary"
            numberOfLines={1}
          >
            {upcoming.text}
          </Text>
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            isMine={item.sender === profile?.$id}
            // visually indicate if it's the upcoming message
            isUpcoming={upcoming ? item.$id === upcoming.$id : false}
            upcomingLabel={upcoming && item.$id === upcoming.$id ? 'Upcoming' : undefined}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
      />

      <MessageInput
        onSend={sendMessage}
        disabled={sending}
        placeholder="Type your message…"
        inputClassName="text-base text-text-primary dark:text-dark-text-primary"
      />
    </Screen>
  );
}
