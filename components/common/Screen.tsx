import { View } from 'react-native';

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 bg-background dark:bg-dark-background px-4 pt-4">
      {children}
    </View>
  );
}
