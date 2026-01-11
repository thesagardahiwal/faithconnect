import React from 'react';
import { StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

interface Props extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText' | 'editable' | 'placeholder' | 'secureTextEntry'> {
  label?: string | React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  editable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  multiline?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  editable = true,
  containerStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  multiline,
  left,
  right,
  ...inputProps
}: Props) {
  return (
    <View style={containerStyle} className="mb-4">
      {label ? (
        <Text style={labelStyle} className="mb-1 text-text-secondary dark:text-dark-text-secondary">
          {label}
        </Text>
      ) : null}
      <View
        style={inputContainerStyle}
        className="flex-row items-center rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-3"
      >
        {left ? <View style={{ marginRight: 7 }}>{left}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={editable}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          style={[
            { flex: 1, paddingVertical: 0 },
            inputStyle,
          ]}
          className="text-text-primary dark:text-dark-text-primary"
          placeholderTextColor="#9ca3af"
          {...inputProps}
        />
        {right ? <View style={{ marginLeft: 7 }}>{right}</View> : null}
      </View>
    </View>
  );
}
