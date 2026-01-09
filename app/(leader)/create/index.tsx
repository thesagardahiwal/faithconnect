import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

function CreateActionButton({ title, icon, onPress, bg = 'bg-primary' }: { title: string; icon: React.ReactNode; onPress: () => void; bg?: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center py-4 rounded-2xl ${bg}`}
      activeOpacity={0.85}
    >
      {icon}
      <Text className="ml-2 text-base font-semibold text-white">{title}</Text>
    </TouchableOpacity>
  );
}

export default function CreateContent() {
  const router = useRouter();

  return (
    <Screen>
      <Header title="Create Content" />
      <View className="mt-10 space-y-5 gap-4 px-4">
        <CreateActionButton
          title="Create Post"
          onPress={() => router.push('/(leader)/create/post')}
          bg="bg-primary"
          icon={<Ionicons name="create-outline" size={22} color="#fff" />}
        />

        <CreateActionButton
          title="Create Reel"
          onPress={() => router.push('/(leader)/create/reel')}
          bg="bg-accent"
          icon={<Ionicons name="film-outline" size={22} color="#fff" />}
        />
      </View>
    </Screen>
  );
}
