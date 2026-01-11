import * as Updates from 'expo-updates';
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';

export function useExpoUpdates() {
  const checkedRef = useRef(false);

  useEffect(() => {
    if (__DEV__) return;
    if (checkedRef.current) return;

    checkedRef.current = true;

    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (!update.isAvailable) return;

        Alert.alert(
          'Update Available',
          'A new version of the app is available. Would you like to download it now?',
          [
            {
              text: 'Later',
              style: 'cancel',
            },
            {
              text: 'Download',
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  Alert.alert(
                    'Update Ready',
                    'The update has been downloaded. Restart app now?',
                    [
                      { text: 'Later', style: 'cancel' },
                      {
                        text: 'Restart',
                        onPress: () => Updates.reloadAsync(),
                      },
                    ]
                  );
                } catch {
                  Alert.alert(
                    'Update Failed',
                    'Could not download the update. Please try again later.'
                  );
                }
              },
            },
          ],
          { cancelable: false }
        );
      } catch (e) {
        console.log('[ExpoUpdates] Check failed:', e);
      }
    })();
  }, []);
}
