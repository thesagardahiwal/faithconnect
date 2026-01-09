import { useColorScheme } from 'react-native';

export type AppTheme = 'light' | 'dark';

export const useTheme = () => {
  const colorScheme = useColorScheme();

  const theme: AppTheme = colorScheme === 'dark' ? 'dark' : 'light';

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};
