import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string;
  description: string;
  onPress: () => void;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: React.ReactNode;
}

export function RoleCard({
  title,
  description,
  onPress,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  children,
  ...touchableProps
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 rounded-2xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6 ${className}`}
      {...touchableProps}
    >
      <Text
        className={`text-lg font-semibold text-text-primary dark:text-dark-text-primary ${titleClassName}`}
      >
        {title}
      </Text>
      <Text
        className={`mt-2 text-text-secondary dark:text-dark-text-secondary ${descriptionClassName}`}
      >
        {description}
      </Text>
      {children}
    </TouchableOpacity>
  );
}
