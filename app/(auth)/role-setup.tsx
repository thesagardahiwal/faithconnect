import { AuthHeader } from '@/components/auth/AuthHeader';
import { RoleCard } from '@/components/auth/RoleCard';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { createUserProfile } from '@/store/services/user.service';
import { UserRole } from '@/types/user.types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';

export default function RoleSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loadProfile } = useUser();

  // Step management
  const [step, setStep] = useState<'choose-role' | 'details'>('choose-role');
  const [selectedRole, setSelectedRole] = useState<UserRole>();
  const [name, setName] = useState('');
  const [faith, setFaith] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: 'worshiper' | 'leader') => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleBackToRoleSelect = () => {
    setStep('choose-role');
    setSelectedRole(undefined);
    // Optional: clear name/faith when going back, or keep as is
    // setName('');
    // setFaith('');
  };

  const handleCreateProfile = async () => {
    if (!user) {
      Alert.alert("User is not logged in!");
      return;
    }
    if (!name.trim() || !faith.trim()) {
      Alert.alert("Please enter your name and faith.");
      return;
    }
    setLoading(true);
    try {
      await createUserProfile(user.$id, {
        userId: user.$id,
        role: selectedRole,
        name: name.trim(),
        faith: faith.trim(),
      });
      router.replace('/');
    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !profile) {
      loadProfile(user.$id);
    };

    if (profile) {
      if (profile.role === "leader") {
        router.replace('/(leader)/home');
      } else {
        router.replace('/(worshiper)/home');
      }
    };

  }, [user, loadProfile, profile, router]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
      className="bg-background dark:bg-dark-background"
    >
      <View className="flex-1 px-6 pt-16">
        {step === 'choose-role' && (
          <>
            <AuthHeader
              title="Choose your path"
              subtitle="How would you like to continue?"
            />

            <RoleCard
              title="Continue as Worshiper"
              description="Follow leaders and receive inspiration"
              onPress={() => handleRoleSelect('worshiper')}
            />

            <RoleCard
              title="Continue as Religious Leader"
              description="Share teachings and guide your followers"
              onPress={() => handleRoleSelect('leader')}
            />
          </>
        )}

        {step === 'details' && (
          <>
            <AuthHeader
              title={
                selectedRole === 'worshiper'
                  ? "Worshiper Details"
                  : "Religious Leader Details"
              }
              subtitle={
                selectedRole === 'worshiper'
                  ? "Tell us about yourself to continue"
                  : "Tell us about yourself to continue"
              }
            />
            <AppInput
              label="Your name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
            <AppInput
              label="Your Faith"
              placeholder="Enter your faith"
              value={faith}
              onChangeText={setFaith}
              editable={!loading}
            />
            <View className="flex-row gap-3 space-x-4 mt-4">
              <View style={{ flex: 1 }}>
                <AppButton
                  title="Back"
                  variant="secondary"
                  onPress={handleBackToRoleSelect}
                  disabled={loading}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppButton
                  title="Continue"
                  variant="primary"
                  loading={loading}
                  onPress={handleCreateProfile}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
