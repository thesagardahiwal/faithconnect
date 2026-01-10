import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import ExpoUpdateChecker from '@/components/system/ExpoUpdateChecker';
import { store } from '@/store';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <CustomSafeAreaView>
        <ExpoUpdateChecker />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </CustomSafeAreaView>
    </Provider>
  );
}
