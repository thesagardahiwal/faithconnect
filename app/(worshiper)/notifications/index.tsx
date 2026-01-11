import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Notifications() {
  const router = useRouter();

  return (
    <Screen>
      <Header
        title="Notifications"
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, color: '#888', textAlign: 'center' }}>
          Notifications are under development.
          {'\n'}
          Check back soon!
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 32,
            paddingVertical: 10,
            paddingHorizontal: 24,
            borderRadius: 8,
            backgroundColor: '#eee',
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#333" />
          <Text style={{ marginLeft: 8, fontSize: 16, color: '#333' }}>
            Back
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
