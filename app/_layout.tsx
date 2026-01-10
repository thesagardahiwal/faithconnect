import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import ExpoUpdateChecker from '@/components/system/ExpoUpdateChecker';
import { store } from '@/store';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
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
        <Toast/>
      </CustomSafeAreaView>
    </Provider>
  );
}
