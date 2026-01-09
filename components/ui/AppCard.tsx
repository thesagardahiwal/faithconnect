import { View } from 'react-native';

export function AppCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-2xl bg-surface dark:bg-dark-surface p-6 shadow-sm">
      {children}
    </View>
  );
}
