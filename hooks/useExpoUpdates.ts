import * as Updates from 'expo-updates';
import { useEffect } from 'react';

export function useExpoUpdates() {
  useEffect(() => {
    if (__DEV__) return; // ❌ never check updates in dev

    (async () => {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      })();

  }, []);

  return;
}
