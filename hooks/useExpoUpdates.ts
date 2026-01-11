import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function useExpoUpdates() {
  useEffect(() => {
    if (__DEV__) return;

    const check = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          Alert.alert(
            'Update Available',
            'A new update is available. Download now?',
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Download',
                onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  Alert.alert(
                    'Update Ready',
                    'Restart app to apply update.',
                    [
                      {
                        text: 'Restart',
                        onPress: () => Updates.reloadAsync(),
                      },
                    ]
                  );
                },
              },
            ]
          );
        }
      } catch (e) {
        console.log('OTA check failed', e);
      }
    };

    check();
  }, []);
}
