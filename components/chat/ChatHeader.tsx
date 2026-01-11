import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { GestureResponderEvent, Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

export interface ChatHeaderProps {
  title?: string;
  onBackPress?: (event: GestureResponderEvent) => void;
  leftIcon?: ReactNode;
  rightContent?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  showBackButton?: boolean;
  backIconName?: string;
  backIconColor?: string;
  backIconSize?: number;
}

export default function ChatHeader({
  title,
  onBackPress,
  leftIcon,
  rightContent,
  containerStyle,
  titleStyle,
  showBackButton = true,
  backIconName = "arrow-back",
  backIconColor = "#2F6FED",
  backIconSize = 22,
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <View
      className="flex-row items-center px-4 py-3 border-b border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
      style={containerStyle}
    >
      {showBackButton && (
        <Pressable
          onPress={onBackPress ? onBackPress : () => router.back()}
          className="rounded-full bg-primary-soft/80 dark:bg-dark-primary-soft/70 p-2 active:bg-primary/20 dark:active:bg-dark-primary/40"
          style={[
            { shadowColor: "#2F6FED", shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }
          ]}
          android_ripple={{ color: "#E8F0FE" }}
          hitSlop={8}
        >
          {leftIcon ? leftIcon : <Ionicons name={backIconName as any} color={backIconColor} size={backIconSize} />}
        </Pressable>
      )}
      <Text
        className="ml-3 flex-1 text-lg font-semibold text-text-primary dark:text-dark-text-primary"
        numberOfLines={1}
        style={titleStyle}
      >
        {title}
      </Text>
      {rightContent ? <View style={{ marginLeft: 10 }}>{rightContent}</View> : null}
    </View>
  );
}
