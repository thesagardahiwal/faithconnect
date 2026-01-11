import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { useTheme } from '@/hooks/useTheme';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

function CreateActionButton({
  title,
  icon,
  onPress,
  bg = 'bg-primary',
  description,
}: {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  bg?: string;
  description?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 py-5 border border-border rounded-2xl dark:border-dark-border ${bg}`}
    >
      <View className="flex-row p-2 mt-2 items-center">
        {icon}
        <View className="ml-3">
          <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">{title}</Text>
          {description && (
            <Text className="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">{description}</Text>
          )}
        </View>
      </View>
      <Ionicons name="arrow-forward-circle" size={26} color="#fff" style={{ marginLeft: 14 }} />
    </TouchableOpacity>
  );
}

export default function CreateContent() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <Screen>
      <Header title="Create Content" />
      <View className="mt-6 items-center">
        <View
          className={`
            rounded-2xl
            w-[98%]
            items-center
            mb-6
            ${isDark ? 'bg-dark-primary-soft' : 'bg-primary-soft'}
            p-5
            `}
        >
          <Text className="text-2xl font-extrabold text-primary dark:text-dark-primary tracking-wider">
            Unleash Your{' '}
            <Text className="text-accent dark:text-dark-accent">Inspiration</Text>
          </Text>
          <Text className="mt-2 text-center text-text-secondary dark:text-dark-text-secondary text-base max-w-xs">
            Share your blessings, wisdom, messages or prayer moments with your followers in a visually beautiful way.
          </Text>
          <View className="mt-5 flex-row gap-5">
            <View className={isDark 
              ? 'bg-dark-primary p-2 rounded-xl shadow-sm' 
              : 'bg-primary/30 p-2 rounded-xl shadow-sm'
            }>
              <MaterialCommunityIcons name="star-four-points" size={28} color="#C9A24D" />
            </View>
            <View className={isDark 
              ? 'bg-dark-primary p-2 rounded-xl shadow-sm' 
              : 'bg-primary/30 p-2 rounded-xl shadow-sm'
            }>
              <Ionicons name="medal-outline" size={28} color="#5B8CFF" />
            </View>
            <View className={isDark 
              ? 'bg-dark-primary p-2 rounded-xl shadow-sm' 
              : 'bg-primary/30 p-2 rounded-xl shadow-sm'
            }>
              <FontAwesome5 name="users" size={25} color={isDark ? "#fff" : "#2F6FED"} />
            </View>
          </View>
        </View>
      </View>
      <View className="space-y-6 gap-5 px-4 pb-2">
        <CreateActionButton
          title="Create Post"
          onPress={() => router.push('/(leader)/create/post')}
          bg="bg-gradient-to-r from-primary to-primary/90 dark:from-dark-primary dark:to-dark-primary"
          icon={
            <Ionicons
              name="create-outline"
              size={28}
              color="#fff"
              style={{
                backgroundColor: isDark ? '#1E3A8A' : '#5139cc',
                borderRadius: 16,
                padding: 6,
                marginRight: 3,
              }}
            />
          }
          description="Share an announcement, message, or scripture."
        />

        <CreateActionButton
          title="Create Reel"
          onPress={() => router.push('/(leader)/create/reel')}
          bg="bg-gradient-to-r from-accent to-accent/90 dark:from-dark-accent dark:to-dark-accent"
          icon={
            <Ionicons
              name="film-outline"
              size={28}
              color="#fff"
              style={{
                backgroundColor: isDark ? '#5B8CFF' : '#297edb',
                borderRadius: 16,
                padding: 6,
                marginRight: 3,
              }}
            />
          }
          description="Record or upload an inspiring short video."
        />

        {/* Future feature preview (premium placeholder) */}
        <TouchableOpacity
          disabled
          activeOpacity={1}
          className="flex-row items-center justify-between px-4 py-5 rounded-2xl bg-surface dark:bg-dark-surface border border-dashed border-border dark:border-dark-border"
          style={{ opacity: 0.55 }}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="calendar-star"
              size={26}
              color={isDark ? "#9CA3AF" : "#b0b0b0"}
              style={{
                backgroundColor: isDark ? "#1E3A8A" : "#eaeaea",
                borderRadius: 12,
                padding: 4
              }}
            />
            <View className="ml-3">
              <Text className="text-base font-semibold text-text-secondary dark:text-dark-text-secondary">Coming Soon</Text>
              <Text className="text-xs text-text-secondary/80 dark:text-dark-text-secondary/80 mt-0.5">
                Special event creation and live features!
              </Text>
            </View>
          </View>
          <Ionicons name="lock-closed" size={22} color={isDark ? "#9CA3AF" : "#bbb"} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>

      {/* Premium Tag & Info Section */}
      <View className="mt-10 px-5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="crown"
            size={22}
            color="#C9A24D"
            style={{ marginRight: 7 }}
          />
          <Text className="text-sm font-semibold text-accent dark:text-dark-accent">Premium</Text>
        </View>
        <Text className="text-xs text-text-secondary dark:text-dark-text-secondary font-medium text-right" style={{ maxWidth: 230 }}>
          Get access to advanced creation tools, event scheduling, analytics and more. 
          <Text className="text-accent dark:text-dark-accent"> Upgrade coming soon.</Text>
        </Text>
      </View>
    </Screen>
  );
}
