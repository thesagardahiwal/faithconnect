import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { useMessages } from '@/hooks/useMessages';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { sendMessage } = useMessages();
  const [text, setText] = useState('');

  return (
    <Screen>
      <Header title="Chat" />

      <View className="flex-1" />

      <TextInput
        value={text}
        onChangeText={setText}
        className="border border-border dark:border-dark-border rounded-xl p-3"
        placeholder="Type a message"
      />

      <AppButton
        title="Send"
        onPress={() => {
          sendMessage(chatId, 'leader-id', text);
          setText('');
        }}
      />
    </Screen>
  );
}
