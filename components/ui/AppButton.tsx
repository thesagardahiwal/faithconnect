import React from 'react';
import { ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  activityColor?: string;
  children?: React.ReactNode;
}

export function AppButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
  textStyle,
  iconLeft,
  iconRight,
  activityColor = '#fff',
  children,
}: Props) {
  const base =
    'rounded-xl py-4 items-center justify-center flex-row';

  const styles =
    variant === 'primary'
      ? 'bg-primary dark:bg-dark-primary'
      : 'bg-primary-soft dark:bg-dark-primary-soft';

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      onPress={onPress}
      className={`${base} ${styles}`}
      style={style}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator color={activityColor} />
      ) : children ? (
        children
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          {iconLeft && <View style={{ marginRight: 7 }}>{iconLeft}</View>}
          <Text
            className="font-semibold text-white"
            style={textStyle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {iconRight && <View style={{ marginLeft: 7 }}>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}
