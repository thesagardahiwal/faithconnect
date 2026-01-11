import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function AppButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: Props) {
  const base =
    'rounded-xl py-4 items-center justify-center';

  const styles =
    variant === 'primary'
      ? 'bg-primary dark:bg-dark-primary'
      : 'bg-primary-soft dark:bg-dark-primary-soft';

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      onPress={onPress}
      className={`${base} ${styles}`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="font-semibold text-white">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
