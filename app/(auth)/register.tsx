import { AuthHeader } from '@/components/auth/AuthHeader';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { _register: register, loading, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (user) {
      router.replace("/(auth)/role-setup");
    }
  }, [user, router]);
  
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
            title="Create account"
            subtitle="Join FaithConnect today"
          />

          <AppInput label="Email" value={email} onChangeText={setEmail} />
          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton
            loading={loading}
            title="Create Account"
            onPress={() => register(email, password)}
          />

          <Pressable disabled={loading} onPress={() => router.back()}>
            <Text className="mt-4 text-center text-primary dark:text-dark-primary">
              Already have an account? Login
            </Text>
          </Pressable>
        </AppCard>
      </View>
    </KeyboardAvoidingView>
  );
}
