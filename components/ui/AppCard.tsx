import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

type AppCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  containerProps?: ViewProps;
};

export function AppCard({
  children,
  className = "rounded-2xl bg-surface dark:bg-dark-surface p-6 shadow-sm",
  style,
  containerProps = {},
}: AppCardProps) {
  return (
    <View
      className={className}
      style={style}
      {...containerProps}
    >
      {children}
    </View>
  );
}
