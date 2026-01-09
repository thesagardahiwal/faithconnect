import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface HeaderProps {
  title: string;
  right?: ReactNode;
}

export default function Header({ title, right }: HeaderProps) {
  return (
    <View className="mb-4 flex-row justify-between items-center">
      <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
        {title}
      </Text>
      {right && <View>{right}</View>}
    </View>
  );
}
