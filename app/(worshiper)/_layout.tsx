import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function WorshiperLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use correct tailwind color mapping
  // See tailwind.config.js for colors
  // bg-surface: #FFFFFF (light) | dark:bg-dark-surface: #111827 (dark)
  // border: #E5E7EB (light) | dark:border-dark-border: #1F2937 (dark)

  const tabBarBgColor = isDark ? '#111827' : '#FFFFFF';
  const tabBarBorderColor = isDark ? '#1F2937' : '#E5E7EB';
  const tabBarActiveTintColor = isDark ? '#5B8CFF' : '#2F6FED'; // theme.primary in each
  const tabBarInactiveTintColor = isDark ? '#9CA3AF' : '#6B7280'; // text-secondary

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBgColor,
          borderTopWidth: 1,
          borderTopColor: tabBarBorderColor,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="leaders/index"
        options={{
          title: 'Leaders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reels/index"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chats/index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

        <Tabs.Screen
            name='leaders/[leaderId]'
            options={{
                href: null
            }}
        />
        <Tabs.Screen
            name='chats/[chatId]'
            options={{
                href: null
            }}
        />
        <Tabs.Screen
            name='notifications/index'
            options={{
                href: null
            }}
        />
    </Tabs>
  );
}
