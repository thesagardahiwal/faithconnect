import { Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  description: string;
  onPress: () => void;
}

export function RoleCard({ title, description, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4 rounded-2xl border border-border dark:border-dark-border
                 bg-surface dark:bg-dark-surface p-6"
    >
      <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
        {title}
      </Text>
      <Text className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        {description}
      </Text>
    </TouchableOpacity>
  );
}
