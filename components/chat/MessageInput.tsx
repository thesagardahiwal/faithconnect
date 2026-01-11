import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  sendBtnClassName?: string;
  sendIconColor?: string;
  placeholder?: string;
  upcomingLabel?: string;
  showUpcoming?: boolean;
  onUpcomingPress?: () => void;
}

export default function MessageInput({
  onSend,
  disabled = false,
  containerClassName = '',
  inputClassName = '',
  sendBtnClassName = '',
  sendIconColor,
  placeholder = "Type a message",
  upcomingLabel = "Upcoming",
  showUpcoming = false,
  onUpcomingPress,
}: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  // Set send icon color: proper white when active, gray when disabled
  let effectiveSendIconColor = "#6B7280"; // default to text-secondary (gray)
  if (!disabled && !!text.trim()) {
    effectiveSendIconColor = "#FFFFFF";
  }

  if (sendIconColor) {
    effectiveSendIconColor = sendIconColor; // allow override
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <View className={
        `flex-row items-center px-4 py-4 border-t border-border dark:border-dark-border bg-surface dark:bg-dark-surface ${containerClassName}`
      }>
        {showUpcoming && (
          <Pressable
            className="flex-row items-center mr-3 rounded-full px-3 py-1 bg-accent/10 border border-accent active:bg-accent/20"
            onPress={onUpcomingPress}
            android_ripple={{ color: "#F6E6C2" }}
          >
            <Ionicons
              name="alarm-outline"
              size={18}
              color="#C9A24D"
              style={{ marginRight: 4 }}
            />
            <Text className="text-accent font-medium text-xs">{upcomingLabel}</Text>
          </Pressable>
        )}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholderTextColor={"#6B7280"}
          placeholder={placeholder}
          editable={!disabled}
          className={
            `flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-border dark:border-dark-border 
            text-text-primary dark:text-dark-text-primary text-base ${inputClassName}`
          }
          style={{ minHeight: 40 }}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          disabled={disabled || !text.trim()}
          className={
            `ml-3 rounded-full p-2 bg-primary ${disabled || !text.trim() ? "opacity-40" : "active:bg-primary/80"} shadow-sm ${sendBtnClassName}`
          }
          android_ripple={{ color: "#E8F0FE" }}
          hitSlop={8}
        >
          <Ionicons name="send" color={effectiveSendIconColor} size={22} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
