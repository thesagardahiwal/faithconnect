import { AuthHeader } from '@/components/auth/AuthHeader';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { _register: register, loading, user, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace("/(auth)/role-setup");
    }
  }, [user, router]);

  const handleRegister = () => {
    setLocalError(null);
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setLocalError('Email and password are required.');
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      setLocalError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    register(email.trim(), password);
  };

  const handleSocialPress = (platform: string) => {
    Alert.alert(
      `${platform} registration`,
      'This feature is coming soon!'
    );
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
            title="Create account"
            subtitle="Join FaithConnect today"
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
              className="mb-4 text-text-primary dark:text-dark-text-primary"
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
                textContentType="newPassword"
                className="pr-12 text-text-primary dark:text-dark-text-primary"
              />
              <Pressable
                onPress={() => setPasswordVisible((v) => !v)}
                className="absolute right-0 top-8 px-3 py-2"
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
            <View className="mb-2">
              <Text className="text-error font-semibold text-center text-sm">{localError || error}</Text>
            </View>
          )}

          <AppButton
            loading={loading}
            title="Create Account"
            onPress={handleRegister}
            className="my-2"
          />

          <View className="my-6 flex flex-row items-center">
            <View className="flex-1 h-[1px] bg-border dark:bg-dark-border"/>
            <Text className="mx-2 text-xs text-text-secondary dark:text-dark-text-secondary">or sign up with</Text>
            <View className="flex-1 h-[1px] bg-border dark:bg-dark-border"/>
          </View>

          <View className="flex-row items-center justify-center gap-4 mb-2">
            <Pressable
              onPress={() => handleSocialPress('Google')}
              className="p-3 rounded-full border border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
              accessibilityRole="button"
              accessibilityLabel="Sign up with Google"
            >
              <Ionicons name="logo-google" size={22} color="#EA4335" />
            </Pressable>
          </View>

          <Pressable disabled={loading} onPress={() => router.back()}>
            <Text className="mt-4 text-center text-primary dark:text-dark-primary font-semibold">
              Already have an account?{' '}
              <Text className="underline">Login</Text>
            </Text>
          </Pressable>
        </AppCard>

        <View className="flex flex-row items-center justify-center mt-6">
          <Text className="text-xs text-text-secondary dark:text-dark-text-secondary text-center">
            By signing up, you agree to our&nbsp;
            <Text
              className="underline text-accent dark:text-dark-accent"
              onPress={() => Alert.alert('Coming soon', 'Terms & Conditions will be available soon!')}
            >
              Terms & Conditions
            </Text>
            .
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
