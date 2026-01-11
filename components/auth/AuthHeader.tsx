import { Text, View } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="mb-8 w-full">
      <Text className="text-[28px] leading-tight font-extrabold text-text-primary dark:text-dark-text-primary tracking-tight">
        {title}
      </Text>
      <Text className="mt-2 text-base leading-relaxed text-text-secondary dark:text-dark-text-secondary font-medium">
        {subtitle}
      </Text>
    </View>
  );
}
