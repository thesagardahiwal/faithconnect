import { Text, TextInput, View } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  editable?:boolean
}

export function AppInput({
  label,
  value,
  placeholder,
  onChangeText,
  secureTextEntry,
  editable,
}: Props) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-text-secondary dark:text-dark-text-secondary">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        secureTextEntry={secureTextEntry}
        className="rounded-xl border border-border dark:border-dark-border px-4 py-3
                   bg-surface dark:bg-dark-surface
                   text-text-primary dark:text-dark-text-primary"
      />
    </View>
  );
}
