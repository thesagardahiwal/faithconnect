import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
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
      className={`flex-row items-center justify-between px-4 py-5 rounded-2xl shadow-md ${bg}`}
      activeOpacity={0.89}
      style={{
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
      }}
    >
      <View className="flex-row items-center">
        {icon}
        <View className="ml-3">
          <Text className="text-lg font-semibold text-white">{title}</Text>
          {description && (
            <Text className="text-xs text-white/80 mt-0.5">{description}</Text>
          )}
        </View>
      </View>
      <Ionicons name="arrow-forward-circle" size={26} color="#fff" style={{ marginLeft: 14 }} />
    </TouchableOpacity>
  );
}

export default function CreateContent() {
  const router = useRouter();

  return (
    <Screen>
      <Header title="Create Content" />
      <View className="mt-6 items-center">
        <View
          style={{
            backgroundColor: '#252952',
            borderRadius: 20,
            padding: 18,
            width: '98%',
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: '#fff',
            shadowOpacity: 0.06,
            shadowRadius: 12,
          }}
        >
          <Text className="text-2xl font-extrabold text-white tracking-wider">
            Unleash Your <Text className="text-accent">Inspiration</Text>
          </Text>
          <Text className="mt-2 text-center text-white/90 text-base max-w-xs">
            Share your blessings, wisdom, messages or prayer moments with your followers in a visually beautiful way.
          </Text>
          <View className="mt-5 flex-row gap-5">
            <View
              style={{
                backgroundColor: '#4633c2',
                borderRadius: 18,
                padding: 7,
                shadowColor: '#fff',
                shadowOpacity: 0.06,
                shadowRadius: 10,
              }}
            >
              <MaterialCommunityIcons name="star-four-points" size={28} color="#fcd34d" />
            </View>
            <View
              style={{
                backgroundColor: '#4633c2',
                borderRadius: 18,
                padding: 7,
              }}
            >
              <Ionicons name="medal-outline" size={28} color="#95befc" />
            </View>
            <View
              style={{
                backgroundColor: '#4633c2',
                borderRadius: 18,
                padding: 7,
              }}
            >
              <FontAwesome5 name="users" size={25} color="#fff" />
            </View>
          </View>
        </View>
      </View>
      <View className="space-y-6 gap-5 px-4 pb-2">
        <CreateActionButton
          title="Create Post"
          onPress={() => router.push('/(leader)/create/post')}
          bg="bg-gradient-to-r from-primary to-primary/90"
          icon={
            <Ionicons
              name="create-outline"
              size={28}
              color="#fff"
              style={{
                backgroundColor: '#5139cc',
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
          bg="bg-gradient-to-r from-accent to-accent/90"
          icon={
            <Ionicons
              name="film-outline"
              size={28}
              color="#fff"
              style={{
                backgroundColor: '#297edb',
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
          className="flex-row items-center justify-between px-4 py-5 rounded-2xl bg-gray-200/30 border border-dashed border-gray-400/30"
          style={{ opacity: 0.55 }}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="calendar-star"
              size={26}
              color="#b0b0b0"
              style={{ backgroundColor: '#eaeaea', borderRadius: 12, padding: 4 }}
            />
            <View className="ml-3">
              <Text className="text-base font-semibold text-gray-600">Coming Soon</Text>
              <Text className="text-xs text-gray-600/80 mt-0.5">
                Special event creation and live features!
              </Text>
            </View>
          </View>
          <Ionicons name="lock-closed" size={22} color="#bbb" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>

      {/* Premium Tag & Info Section */}
      <View className="mt-10 px-5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="crown"
            size={22}
            color="#f8d54e"
            style={{ marginRight: 7 }}
          />
          <Text className="text-sm font-semibold text-accent">Premium</Text>
        </View>
        <Text className="text-xs text-gray-400 font-medium text-right" style={{ maxWidth: 230 }}>
          Get access to advanced creation tools, event scheduling, analytics and more. 
          <Text className="text-accent"> Upgrade coming soon.</Text>
        </Text>
      </View>
    </Screen>
  );
}
