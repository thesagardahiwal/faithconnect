import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { AppInput } from '@/components/ui/AppInput';
import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { useMedia } from '@/hooks/useMedia';
import { useUser } from '@/hooks/useUser';
import { storage } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const FAITHS = [
  { name: 'Christian', desc: 'Belief in Jesus Christ as savior' },
  { name: 'Muslim', desc: 'Islamic faith and the Prophet Muhammed' },
  { name: 'Jewish', desc: 'Jewish faith and heritage' },
  { name: 'Buddhist', desc: 'Belief in Buddha and the Eightfold Path' },
  { name: 'Hindu', desc: 'Hindu gods, rituals and cycle' },
  { name: 'Sikh', desc: 'Sikh beliefs and traditions' },
  { name: 'Other', desc: 'Other or exploring' },
];

function getProfileImageUrl(imgId: string | undefined): string | null {
  if (!imgId) return null;
  try {
    return storage.getFileViewURL(APPWRITE_CONFIG.buckets.postMedia, imgId).toString();
  } catch {
    return null;
  }
}

function getFaithEmoji(faith: string) {
  const emojiMap: Record<string, string> = {
    Christian: '✝️',
    Muslim: '☪️',
    Jewish: '✡️',
    Buddhist: '☸️',
    Hindu: '🕉️',
    Sikh: '🪯',
    Other: '🌈',
  };
  return emojiMap[faith] || '🌈';
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateUserProfile } = useUser();
  const { user, logout } = useAuth();
  const { pickImage, upload } = useMedia();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [name, setName] = useState('');
  const [faith, setFaith] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setFaith(profile.faith || '');
      setBio(profile.bio || '');
      setPhotoUrl(profile.photoUrl);
    }
  }, [profile]);

  useEffect(() => {
    if (photoUrl) {
      const url = getProfileImageUrl(photoUrl);
      setProfileImgUrl(url);
      setImgFailed(false);
    } else {
      setProfileImgUrl(null);
    }
  }, [photoUrl]);

  const handleSave = async () => {
    if (!profile?.$id) {
      Alert.alert('Error', 'Profile not found');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (!faith.trim()) {
      Alert.alert('Error', 'Faith is required');
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(profile.$id, {
        name: name.trim(),
        faith: faith.trim(),
        bio: bio.trim() || undefined,
        photoUrl,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const asset = await pickImage();
      if (!asset) return;
      setUploadingPhoto(true);
      const fileId = await upload(asset, 'image');
      setPhotoUrl(fileId);
      setUploadingPhoto(false);
    } catch (error: any) {
      setUploadingPhoto(false);
      Alert.alert('Error', error?.message || 'Failed to upload image');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? All your data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error: any) {
              setLoggingOut(false);
              Alert.alert('Error', error?.message || 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <Screen>
        <Header title="Profile" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView className="flex-1 bg-background dark:bg-dark-background" showsVerticalScrollIndicator={false}>
        <View className="bg-primary-soft rounded-xl dark:bg-dark-primary-soft pb-10 border-b border-border dark:border-dark-border">
          <View className="w-full h-24 bg-gradient-to-r from-primary/80 to-accent/30 rounded-b-3xl absolute top-0 left-0 z-0" />
          <View className="z-10 px-5 pt-8 flex-row items-center justify-between">
            <View className="relative mt-5">
              <View className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-dark-primary-soft dark:to-dark-accent items-center justify-center overflow-hidden border-4 border-white dark:border-dark-surface shadow-lg">
                {profileImgUrl && !imgFailed ? (
                  <Image
                    source={{ uri: profileImgUrl }}
                    style={{ width: 144, height: 144 }}
                    contentFit="cover"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <Ionicons name="person" size={72} color="#9CA3AF" />
                )}
              </View>
              {isEditing && (
                <Pressable
                  onPress={handlePickImage}
                  disabled={uploadingPhoto}
                  className="absolute bottom-3 right-3 bg-accent rounded-full p-3 border-4 border-white dark:border-dark-surface shadow-md z-20"
                >
                  {uploadingPhoto ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={22} color="white" />
                  )}
                </Pressable>
              )}
            </View>
            <View className="items-end mt-9">
              {!isEditing ? (
                <View className="flex-row space-x-1">
                  <Pressable
                    onPress={() => setIsEditing(true)}
                    className="p-2 rounded-full bg-accent/10"
                  >
                    <Ionicons name="create-outline" size={22} color="#C9A24D" />
                  </Pressable>
                </View>
              ) : (
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => {
                      setIsEditing(false);
                      if (profile) {
                        setName(profile.name || '');
                        setFaith(profile.faith || '');
                        setBio(profile.bio || '');
                        setPhotoUrl(profile.photoUrl);
                      }
                    }}
                    className="px-4 py-2 rounded-full border border-border dark:border-dark-border"
                  >
                    <Text className="text-text-secondary dark:text-dark-text-secondary font-medium">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    disabled={loading}
                    className="px-4 py-2 rounded-full bg-accent"
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className="text-white font-semibold">Save</Text>
                    )}
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="px-5 pt-8 pb-20">
          
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">
              Name
            </Text>
            {isEditing ? (
              <AppInput
                label=""
                value={name}
                onChangeText={setName}
                editable={isEditing}
                placeholder="Enter your name"
                placeholderTextColor={"gray"}
                className="mb-0 text-text-primary dark:text-dark-text-primary"
              />
            ) : (
              <View className="bg-surface dark:bg-dark-surface p-4 rounded-xl border border-border dark:border-dark-border">
                <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">{name || 'No name yet. Tap edit to add your name.'}</Text>
              </View>
            )}
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">Faith</Text>
            {isEditing ? (
              <View className="flex-row flex-wrap gap-2">
                {FAITHS.map((f) => (
                  <Pressable
                    key={f.name}
                    onPress={() => setFaith(f.name)}
                    className={[
                      'px-4 py-2 rounded-xl flex-row items-center border transition-all',
                      faith === f.name
                        ? 'border-primary bg-primary-soft dark:bg-dark-primary/70'
                        : 'border-border dark:border-dark-border bg-surface dark:bg-dark-surface'
                    ].join(' ')}
                  >
                    <Text className="mr-2 text-xl">{getFaithEmoji(f.name)}</Text>
                    <Text
                      className={[
                        'font-semibold mr-1',
                        faith === f.name ? 'text-primary dark:text-dark-primary' : 'text-text-secondary dark:text-dark-text-secondary'
                      ].join(' ')}
                    >
                      {f.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="flex-row items-center bg-surface dark:bg-dark-surface p-4 rounded-xl border border-border dark:border-dark-border">
                <Text className="text-2xl mr-3">{getFaithEmoji(faith)}</Text>
                <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">{faith}</Text>
              </View>
            )}
          </View>
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">Bio</Text>
            {isEditing ? (
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                className="rounded-xl border border-border dark:border-dark-border px-4 py-3 bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary min-h-[120px] text-base"
                textAlignVertical="top"
                maxLength={400}
              />
            ) : (
              <View className="bg-surface dark:bg-dark-surface p-4 rounded-xl border border-border dark:border-dark-border">
                <Text className="text-base text-text-primary dark:text-dark-text-primary leading-6">{bio || 'No bio yet. Tap edit to add a bio.'}</Text>
              </View>
            )}
          </View>
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">Account</Text>
            <View className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border overflow-hidden">
              <View className="px-4 py-3 border-b border-border dark:border-dark-border">
                <Text className="text-xs text-text-secondary dark:text-dark-text-secondary mb-1">Email</Text>
                <Text className="text-base text-text-primary dark:text-dark-text-primary font-medium">{user?.email || 'N/A'}</Text>
              </View>
              <View className="px-4 py-3 flex-row items-center justify-between">
                <Text className="text-xs text-text-secondary dark:text-dark-text-secondary">Account ID</Text>
                <Text className="text-xs text-text-secondary">{user?.$id ? user.$id.slice(0, 8) + '...' : 'N/A'}</Text>
              </View>
            </View>
          </View>
          <View className="mb-10">
            <Pressable
              onPress={handleLogout}
              disabled={loggingOut}
              className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4 flex-row items-center justify-center"
              style={{ opacity: loggingOut ? 0.7 : 1 }}
            >
              {loggingOut ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <>
                  <Text>
                    <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
                  </Text>
                  <Text className="text-red-600 dark:text-red-400 font-semibold text-base">Logout</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
