import { Text, View } from 'react-native';

interface Props {
  text: string;
  isMine: boolean;
}

export default function MessageBubble({ text, isMine }: Props) {
  return (
    <View
      className={`max-w-[75%] px-4 py-2 rounded-2xl mb-2 ${
        isMine
          ? 'self-end bg-primary'
          : 'self-start bg-surface'
      }`}
    >
      <Text className={isMine ? 'text-white' : ''}>
        {text}
      </Text>
    </View>
  );
}
