import { AuthHeader } from '@/components/auth/AuthHeader';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { _login: login, loading, user, error } = useAuth();
  const { loadProfile } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile(user.$id);
      router.replace('/');
    }
  }, [user, router, loadProfile]);

  // Add more input validation for user experience
  const handleLogin = () => {
    setLocalError(null);
    if (!email.trim() || !password.trim()) {
      setLocalError('Email and password are required');
      return;
    }
    login(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
      className="bg-background dark:bg-dark-background"
    >
      <View className="flex-1 justify-center px-6">
        <AppCard className="py-8 px-6 shadow-lg">
          <AuthHeader
            title="Welcome back"
            subtitle="Sign in to continue your spiritual journey"
          />
          <View className="mt-6">
            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              textContentType="username"
              className="text-text-primary dark:text-dark-text-primary"
            />
            <View className="mb-4 relative">
              <AppInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                textContentType="password"
                className="pr-12 text-text-primary dark:text-dark-text-primary"
              />
              <Pressable
                onPress={() => setPasswordVisible((v) => !v)}
                className="absolute right-0 top-7 px-3 py-2"
                style={{ height: 40, justifyContent: 'center' }}
                accessibilityRole="button"
                accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#A3A3A3"
                />
              </Pressable>
            </View>
          </View>

          {(localError || error) && (
            <View className="mb-3">
              <Text className="text-error font-semibold text-center text-sm">{localError || error}</Text>
            </View>
          )}

          <AppButton
            title="Sign In"
            loading={loading}
            onPress={handleLogin}
            className="my-2"
          />

          <View className="my-6 flex flex-row items-center">
            <View className="flex-1 h-[1px] bg-border dark:bg-dark-border"/>
            <Text className="mx-2 text-xs text-text-secondary dark:text-dark-text-secondary">or sign in with</Text>
            <View className="flex-1 h-[1px] bg-border dark:bg-dark-border"/>
          </View>

          <View className="flex-row items-center justify-center gap-4 mb-2">
            <Pressable
              onPress={() => {
                alert("This feature is coming soon!");
              }}
              className="p-3 rounded-full border border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
            >
              <Ionicons name="logo-google" size={22} color="#EA4335" />
            </Pressable>
          </View>

          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text className="mt-4 text-center text-primary dark:text-dark-primary font-semibold">
              Don’t have an account?{' '}
              <Text className="underline">Register</Text>
            </Text>
          </Pressable>

        </AppCard>
        <View className="flex flex-row items-center justify-center mt-6">
          <Text className="text-xs text-text-secondary dark:text-dark-text-secondary text-center">
            By signing in, you agree to our&nbsp;
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
