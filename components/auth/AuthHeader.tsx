import { Text, View } from 'react-native';

export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-8">
      <Text className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">
        {title}
      </Text>
      <Text className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        {subtitle}
      </Text>
    </View>
  );
}
