import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface EmptyStateProps {
  /** Main message (required) */
  text: string;

  /** Optional title above text */
  title?: string;

  /** Optional icon name */
  icon?: keyof typeof Ionicons.glyphMap;

  /** Optional action button label */
  actionLabel?: string;

  /** Optional action handler */
  onAction?: () => void;
}

export default function EmptyState({
  title,
  text,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      {icon && (
        <Ionicons
          name={icon}
          size={48}
          color="#9CA3AF"
          style={{ marginBottom: 12 }}
        />
      )}

      {title && (
        <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2 text-center">
          {title}
        </Text>
      )}

      <Text className="text-text-secondary dark:text-dark-text-secondary text-center mb-4">
        {text}
      </Text>

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="px-6 py-3 rounded-full bg-primary"
        >
          <Text className="text-white font-semibold">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
