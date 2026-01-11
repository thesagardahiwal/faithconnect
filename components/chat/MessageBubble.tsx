import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Props {
  text: string;
  isMine: boolean;
  isUpcoming?: boolean; // highlight as "upcoming"
  timestamp?: string;   // date/time display under the bubble
  status?: 'sent' | 'pending' | 'failed'; // message status
  containerClassName?: string; // tailwind string override for outer
  textClassName?: string;      // tailwind string override for main text
  style?: StyleProp<ViewStyle>; // RN style override
  textStyle?: StyleProp<TextStyle>; // RN style fo text
  upcomingLabel?: string;      // label override
}

export default function MessageBubble({
  text,
  isMine,
  isUpcoming = false,
  timestamp,
  status,
  containerClassName,
  textClassName,
  style,
  textStyle,
  upcomingLabel = 'Upcoming',
}: Props) {
  // Bubble background and border according to state and tailwind.config.js
  const bubbleBg = isUpcoming
    ? 'bg-accent/10 border border-accent'
    : isMine
    ? 'bg-primary'
    : 'bg-surface border border-border dark:bg-dark-surface dark:border-dark-border';

  // Main text color
  const textColor = isUpcoming
    ? 'text-accent'
    : isMine
    ? 'text-white'
    : 'text-text-primary dark:text-dark-text-primary';

  // Status color
  const statusColor =
    status === 'failed'
      ? 'text-error dark:text-dark-error'
      : status === 'pending'
      ? 'text-text-secondary dark:text-dark-text-secondary'
      : '';

  // Time
  const timeClass = 'text-xs ml-1 text-text-secondary dark:text-dark-text-secondary';

  // Compose container classes
  const baseContainer =
    "max-w-[75%] px-4 py-2 rounded-2xl mb-2 " +
    (isMine ? "self-end" : "self-start") +
    " " +
    bubbleBg +
    (isUpcoming ? " shadow-md" : "");

  return (
    <View
      className={
        containerClassName
          ? `${baseContainer} ${containerClassName}`
          : baseContainer
      }
      style={[
        style,
        isUpcoming ? { opacity: 0.85 } : undefined,
      ]}
    >
      {isUpcoming && (
        <Text className="text-xs font-semibold mb-1 text-accent tracking-wide uppercase">
          {upcomingLabel}
        </Text>
      )}
      <Text className={
        textClassName
          ? `text-base ${textColor} ${textClassName}`
          : `text-base ${textColor}`
      }
      style={textStyle}
      >
        {text}
      </Text>
      {(timestamp || (status && status !== 'sent')) && (
        <View className="flex-row items-center mt-1">
          {timestamp && (
            <Text className={timeClass}>{timestamp}</Text>
          )}
          {status && status !== 'sent' && (
            <Text className={`ml-2 text-xs font-medium ${statusColor}`}>
              {status === 'pending'
                ? 'Sending...'
                : status === 'failed'
                  ? 'Failed'
                  : ''}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
