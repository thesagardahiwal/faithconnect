import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

const getThemeColors = (colorScheme: string | null) => {
  const isDark = colorScheme === 'dark';

  // Use correct tailwind color mapping
  // See tailwind.config.js for colors
  // bg-surface: #FFFFFF (light) | dark:bg-dark-surface: #111827 (dark)
  // border: #E5E7EB (light) | dark:border-dark-border: #1F2937 (dark)

  const tabBarBgColor = isDark ? '#111827' : '#FFFFFF';
  const tabBarBorderColor = isDark ? '#1F2937' : '#E5E7EB';
  const tabBarActiveTintColor = isDark ? '#5B8CFF' : '#2F6FED'; // theme.primary in each
  const tabBarInactiveTintColor = isDark ? '#9CA3AF' : '#6B7280'; // text-secondary

  return {
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarBackground: tabBarBgColor,
    tabBarBorderTopColor: tabBarBorderColor,
  };
};

export default function LeaderLayout() {
  const colorScheme = useColorScheme();
  const {
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarBackground,
    tabBarBorderTopColor,
  } = getThemeColors(colorScheme ?? 'light');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          borderTopColor: tabBarBorderTopColor,
          paddingBottom: 8,
          paddingTop: 4,
          height: 58, // Controls overall height; adjust for less bottom space
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="create/index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="reels/index"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Hide deep routes from tab bar */}
      <Tabs.Screen
        name="create/post"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create/reel"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chats/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chats/[chatId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="followers/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="leaders/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="leaders/[leaderId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
