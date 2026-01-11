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
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

export default function RoleSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loadProfile } = useUser();

  // Step management
  const [step, setStep] = useState<'choose-role' | 'details'>('choose-role');
  const [selectedRole, setSelectedRole] = useState<UserRole>();
  const [name, setName] = useState('');
  const [faith, setFaith] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRoleSelect = (role: 'worshiper' | 'leader') => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleBackToRoleSelect = () => {
    setStep('choose-role');
    setSelectedRole(undefined);
    // setName('');
    // setFaith('');
    // setBio('');
    // setLocation('');
    setLocalError(null);
  };

  const handleCreateProfile = async () => {
    if (!user) {
      Alert.alert("User is not logged in!");
      return;
    }
    if (!name.trim() || !faith.trim()) {
      setLocalError("Please enter your name and faith.");
      return;
    }
    setLoading(true);
    try {
      await createUserProfile(user.$id, {
        userId: user.$id,
        role: selectedRole,
        name: name.trim(),
        faith: faith.trim(),
        bio: bio.trim(),
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
    }

    if (profile) {
      if (profile.role === "leader") {
        router.replace('/(leader)/home');
      } else {
        router.replace('/(worshiper)/home');
      }
    }
  }, [user, loadProfile, profile, router]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
      className="bg-background dark:bg-dark-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-4 pt-12">
          <View className="mb-8 flex items-center">
            <Text className="text-3xl font-extrabold text-primary dark:text-dark-primary mb-1">
              Welcome!
            </Text>
            <Text className="text-base text-text-secondary dark:text-dark-text-secondary text-center">
              Let&apos;s get you set up on FaithConnect
            </Text>
          </View>
          
          {step === 'choose-role' && (
            <View>
              <AuthHeader
                title="Choose your path"
                subtitle="How would you like to continue?"
              />

              <View className="space-y-4 mt-6">
                <RoleCard
                  title="Continue as Worshiper"
                  description="Follow leaders, receive inspiration, and connect with a welcoming community."
                  onPress={() => handleRoleSelect('worshiper')}
                  className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl shadow"
                />

                <RoleCard
                  title="Continue as Religious Leader"
                  description="Share teachings, guide your followers, and spread your message."
                  onPress={() => handleRoleSelect('leader')}
                  className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl shadow"
                />
              </View>

              <View className="mt-12">
                <Text className="text-center text-xs text-text-secondary dark:text-dark-text-secondary">
                  Your chosen path personalizes your FaithConnect experience.
                </Text>
              </View>
            </View>
          )}

          {step === 'details' && (
            <View>
              <AuthHeader
                title={
                  selectedRole === 'worshiper'
                    ? "Worshiper Details"
                    : "Religious Leader Details"
                }
                subtitle={
                  selectedRole === 'worshiper'
                    ? "Tell us about yourself to continue"
                    : "Help us complete your profile to get the best out of FaithConnect"
                }
              />
              <View className="space-y-4 mt-6">
                <AppInput
                  label="Your Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                  className="text-text-primary dark:text-dark-text-primary"
                />
                <AppInput
                  label="Your Faith"
                  placeholder="e.g. Christianity, Islam, Hinduism..."
                  value={faith}
                  onChangeText={setFaith}
                  editable={!loading}
                  className="text-text-primary dark:text-dark-text-primary"
                />
                <AppInput
                  label="Short Bio (optional)"
                  placeholder="Tell us something about yourself"
                  value={bio}
                  onChangeText={setBio}
                  editable={!loading}
                  multiline={true}
                  numberOfLines={3}
                  className="text-text-primary dark:text-dark-text-primary"
                  inputStyle={{ minHeight: 72, textAlignVertical: 'top' }}
                />
              </View>
              {(localError) && 
                <View className="mt-2 mb-2">
                  <Text className="text-error dark:text-dark-error text-center font-semibold">{localError}</Text>
                </View>
              }
              <View className="flex-row gap-3 space-x-4 mt-8">
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
                    title="Finish Setup"
                    variant="primary"
                    loading={loading}
                    onPress={handleCreateProfile}
                  />
                </View>
              </View>
              <View className="mt-8">
                <Text className="text-xs text-center text-text-secondary dark:text-dark-text-secondary">
                  By proceeding, you agree to our{" "}
                  <Text
                    className="underline text-accent dark:text-dark-accent"
                    onPress={() =>
                      Alert.alert(
                        "Coming soon!",
                        "Terms & Conditions will be available soon."
                      )
                    }
                  >
                    Terms & Conditions
                  </Text>
                  .
                </Text>
              </View>
            </View>
          )}

          {/* Add footer tip for accessibility */}
          <View className="mt-6 mb-6">
            <Text className="text-center text-[11px] text-text-secondary dark:text-dark-text-secondary">
              Having trouble? You can always edit your profile later in settings.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
