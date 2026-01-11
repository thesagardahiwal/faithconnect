import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

export default function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <View className="flex-row items-center px-4 py-4 border-t border-border dark:border-dark-border">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholderTextColor={"gray"}
        placeholder="Type a message"
        className="flex-1 dark:text-primary-soft text-dark-primary-soft px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800"
      />
      <Pressable onPress={handleSend} disabled={disabled} className="ml-3">
        <Ionicons name="send" color={"white"} size={24} />
      </Pressable>
    </View>
  );
}
