import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

const getThemeColors = (colorScheme: string | null) => {
  if (colorScheme === 'dark') {
    return {
      tabBarActiveTintColor: '#2F6FED', // Tailwind primary
      tabBarInactiveTintColor: '#7C88A1', // Tailwind dark-text-tertiary or gray-400
      tabBarBackground: '#111827', // Tailwind dark-bg
      tabBarBorderTopColor: '#1F2937', // Tailwind dark-border
    };
  }
  return {
    tabBarActiveTintColor: '#2F6FED', // Tailwind primary
    tabBarInactiveTintColor: '#7C88A1', // Tailwind text-tertiary or gray-400
    tabBarBackground: '#FFF', // Tailwind bg
    tabBarBorderTopColor: '#E5E7EB', // Tailwind border
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
