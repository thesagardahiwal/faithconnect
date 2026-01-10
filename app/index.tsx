import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { getItem } from '@/lib/manageStorage';
import { Redirect, Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const USER_KEY = 'user_info';
const PROFILE_KEY = 'user_profile';

export default function RootLayout() {
  const { user, loading, restoreSession } = useAuth();
  const { profile, loadProfile } = useUser();
  const [initializing, setInitializing] = useState(true);

  // On mount, load user and profile from storage first, then verify with API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, try to load user from storage
        const storedUser = await getItem(USER_KEY);
        const storedProfile = await getItem(PROFILE_KEY);
        console.log(storedUser, storedProfile)
        if (storedUser) {
          // User found in storage, verify session with API
          restoreSession();
          
          // If profile also exists in storage, load it
          if (storedProfile && storedProfile.userId === storedUser.$id) {
            loadProfile(storedUser.$id);
          } else if (storedUser) {
            // User exists but profile doesn't, try to load it
            loadProfile(storedUser.$id);
          }
        } else {
          // No user in storage, mark as initialized (will redirect to login)
          setInitializing(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [restoreSession, loadProfile]);

  // Once loading completes (after restoreSession), mark as initialized
  useEffect(() => {
    if (!loading && initializing) {
      setInitializing(false);
    }
  }, [loading, initializing]);

  // 1: Wait until initialization completes
  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2: Not logged in → Login flow
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // 3b: Session exists, profile failed to load/is missing → redirect to role setup
  if (user && !profile) {
    // This assumes profile is explicitly set to null if not found in loadProfile
    return <Redirect href="/(auth)/role-setup" />;
  }
  // 4: Profile exists, redirect based on role
  if (profile?.role === 'worshiper') {
    return <Redirect href="/(worshiper)/home" />;
  }
  if (profile?.role === 'leader') {
    return <Redirect href="/(leader)/dashboard" />;
  }

  // If profile shape is unexpected for some reason, fallback to slot
  return <Slot />;
}