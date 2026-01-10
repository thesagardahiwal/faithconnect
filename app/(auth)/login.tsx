import { AuthHeader } from '@/components/auth/AuthHeader';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { _login: login, loading, user } = useAuth();
  const { loadProfile } = useUser()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile(user.$id);
      router.replace('/');
    }
  }, [user, router, loadProfile]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
      className="bg-background dark:bg-dark-background"
    >
      <View className="flex-1 justify-center px-6">
        <AppCard>
          <AuthHeader
            title="Welcome back"
            subtitle="Sign in to continue your spiritual journey"
          />

          <AppInput label="Email" value={email} onChangeText={setEmail} />
          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton
            title="Sign In"
            loading={loading}
            onPress={() => login(email, password)}
          />

          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text className="mt-4 text-center text-primary dark:text-dark-primary">
              Don’t have an account? Register
            </Text>
          </Pressable>
      
        </AppCard>
      </View>
    </KeyboardAvoidingView>
  );
}
