import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function WorshiperLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#90cdf4' : '#2563eb', // blue-400/dark: blue-600
        tabBarInactiveTintColor: isDark ? '#a1a1aa' : '#94a3b8', // zinc-400/slate-400
        tabBarStyle: {
          backgroundColor: isDark ? '#18181b' : '#fff', // dark:bg-neutral-900 / light:bg-white
          borderTopWidth: 1,
          borderTopColor: isDark ? '#27272a' : '#e5e7eb', // dark:border-neutral-800 / light:border-gray-200
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
            name='notifications/index'
            options={{
                href: null
            }}
        />
    </Tabs>
  );
}
