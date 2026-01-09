import { Pressable, Text } from 'react-native';

interface Props {
  label: string;
  onPick: () => void;
}

export function MediaPicker({ label, onPick }: Props) {
  return (
    <Pressable
      onPress={onPick}
      className="rounded-xl border border-dashed border-border
                 dark:border-dark-border p-4 items-center"
    >
      <Text className="text-text-secondary dark:text-dark-text-secondary">
        {label}
      </Text>
    </Pressable>
  );
}
