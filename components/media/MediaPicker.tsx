import React from 'react';
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Props {
  label?: string | React.ReactNode;
  onPick: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export function MediaPicker({
  label,
  onPick,
  disabled = false,
  style,
  textStyle,
  iconLeft,
  iconRight,
  children,
}: Props) {
  return (
    <Pressable
      onPress={onPick}
      disabled={disabled}
      className={[
        "rounded-xl border border-dashed border-border dark:border-dark-border p-4 items-center flex-row justify-center",
        disabled ? "opacity-40" : ""
      ].join(' ')}
      style={style}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {children ? (
        children
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {iconLeft && <View style={{ marginRight: 7 }}>{iconLeft}</View>}
          {typeof label === 'string' ? (
            <Text className="text-text-secondary dark:text-dark-text-secondary" style={textStyle}>
              {label}
            </Text>
          ) : (
            label
          )}
          {iconRight && <View style={{ marginLeft: 7 }}>{iconRight}</View>}
        </View>
      )}
    </Pressable>
  );
}
