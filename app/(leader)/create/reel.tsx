import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { MediaPicker } from '@/components/media/MediaPicker';
import { UploadPreview } from '@/components/media/UploadPreview';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useMedia } from '@/hooks/useMedia';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { databases } from '@/lib/appwrite';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ID } from 'react-native-appwrite';

export default function CreateReel() {
  const router = useRouter();
  const { profile } = useUser();
  const { pickVideo, upload } = useMedia();
  const { isDark } = useTheme();

  const [text, setText] = useState('');
  const [videoAsset, setVideoAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Enhanced validation states and UX like the post creator
  const [textError, setTextError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Colors from tailwind config for runtime use (copied & adapted from post.tsx)
  const tailwindColors = {
    background: isDark ? "#0F172A" : "#F9FAFB",
    card: isDark ? "#111827" : "#FFFFFF",
    cardAccent: isDark ? "#1E293B" : "#22244d",
    text: isDark ? "#F9FAFB" : "#111827",
    textSecondary: isDark ? "#9CA3AF" : "#6B7280",
    accent: isDark ? "#E3C770" : "#C9A24D",
    outline: isDark ? "#1F2937" : "#E5E7EB",
    link: isDark ? "#5B8CFF" : "#2F6FED",
    info: isDark ? "#B0DAFF" : "#81e1ff",
    attention: isDark ? "#f59e42" : "#f59e42",
    warn: isDark ? "#F87171" : "#DC2626",
    gradientFrom: "#4a35df",
    gradientTo: "#784ebc",
    blueGray: isDark ? "#1e293b" : "#dbeafe"
  };

  // Validation logic for the reel (video required; caption max 300 chars)
  const validateInput = () => {
    let valid = true;
    setTextError(null);
    setVideoError(null);

    if (!videoAsset) {
      setVideoError('Please select a video to create a reel.');
      valid = false;
    }
    if (text && text.length > 300) {
      setTextError('Caption is too long (max. 300 characters).');
      valid = false;
    }
    return valid;
  };

  const handlePickVideo = async () => {
    const asset = await pickVideo();
    if (asset) {
      setVideoAsset(asset);
      setVideoError(null); // clear error immediately upon pick
    }
  };

  const handleRemoveVideo = () => {
    setVideoAsset(null);
    setVideoError(null);
  };

  const handleTextChange = (msg: string) => {
    setText(msg);
    if (textError && msg.length <= 300) setTextError(null);
    if (videoError && videoAsset) setVideoError(null); // defensive: clear video error if video exists
  };

  const handlePublish = async () => {
    if (!validateInput()) {
      return;
    }

    if (!profile) {
      Alert.alert('Not signed in', 'Please sign in to publish a reel.');
      return;
    }

    try {
      setLoading(true);

      // Upload video
      const mediaFileId = await upload(videoAsset, 'video');

      // Create reel document
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.posts,
        ID.unique(),
        {
          leader: profile.$id,
          type: 'reel',
          text: text || '',
          mediaUrl: mediaFileId,
          likesCount: 0,
        }
      );

      setText('');
      setVideoAsset(null);

      // Success alert
      Alert.alert('Reel Published!', 'Your reel has been published.', [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]);
    } catch (error: any) {
      console.error('Error creating reel:', error);
      Alert.alert('Error', error?.message || 'Failed to publish reel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Header title="New Reel" />

          {/* Enhanced guidance and card */}
          <View
          className={`${isDark ? "bg-dark-surface" : "bg-primary-soft"}`}
            style={{
              marginHorizontal: 20,
              marginTop: 24,
              marginBottom: 8,
              // backgroundColor: tailwindColors.cardAccent,
              borderRadius: 17,
              padding: 22,
              // shadowColor: tailwindColors.link,
              shadowOpacity: 0.14,
              shadowRadius: 5,
              elevation: 3,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <MaterialCommunityIcons name="movie-open-outline" size={28} color={tailwindColors.info} />
              <Text style={{
                fontWeight: '700',
                fontSize: 20,
                color: tailwindColors.text,
                marginLeft: 10,
                letterSpacing: 0.2
              }}>
                Share a Reel Moment!
              </Text>
            </View>
            <Text 
            className='text-primary-soft dark:text-dark-primary'
            style={{
              fontSize: 15,
              marginBottom: 18,
              opacity: 0.8,
            }}>
              Select a fun or powerful video to inspire, teach, or uplift your followers. Add a brief caption (optional).
            </Text>

            {/* Caption input */}
            <View style={{ marginBottom: 8 }}>
              <AppInput
                label={
                  <Text>
                    <Text style={{ color: tailwindColors.text, fontWeight: "600" }}>Caption </Text>
                    <Text style={{ color: tailwindColors.info, fontWeight: "400", fontSize: 13 }}>
                      (optional, max 300 chars)
                    </Text>
                  </Text>
                }
                value={text}
                onChangeText={handleTextChange}
                placeholder="Add a caption to your reel..."
                multiline={true}
                inputStyle={{
                  color: tailwindColors.text,
                }}
                // Pass thorugh any error state if needed
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {textError ? (
                  <Text style={{
                    color: tailwindColors.warn,
                    fontSize: 13,
                    fontWeight: '600'
                  }}>
                    {textError}
                  </Text>
                ) : (
                  <Text style={{
                    color: text.length > 250 ? tailwindColors.attention : tailwindColors.textSecondary,
                    fontSize: 12,
                    alignSelf: 'flex-end',
                    fontVariant: ['tabular-nums'],
                    letterSpacing: 0.3,
                    fontWeight: text.length > 270 ? 'bold' : '500'
                  }}>
                    {text.length}/300
                  </Text>
                )}
                {/* Visual indicator bar for character count */}
                <View style={{
                  flex: 1,
                  height: 6,
                  marginLeft: 12,
                  backgroundColor: isDark ? tailwindColors.background : tailwindColors.cardAccent,
                  borderRadius: 5,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    width: `${Math.min(100, (text.length / 300) * 100)}%`,
                    height: '100%',
                    backgroundColor:
                      text.length < 250
                        ? tailwindColors.info
                        : text.length <= 300
                          ? tailwindColors.attention
                          : tailwindColors.warn,
                    borderRadius: 4,
                  }} />
                </View>
              </View>
            </View>

            {/* Video picker */}
            <MediaPicker
              label={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                  <MaterialCommunityIcons name="video-plus" size={26} color={isDark ? tailwindColors.info : "#7ecddd"} />
                  <Text style={{
                    color: videoError
                      ? tailwindColors.warn
                      : isDark
                        ? tailwindColors.info
                        : "#84cbf7",
                    fontSize: 16, fontWeight: videoAsset ? 'bold' : '600'
                  }}>
                    {videoAsset ? 'Change Video' : 'Add Video (required)'}
                  </Text>
                </View>
              }
              onPick={handlePickVideo}
              style={{
                marginTop: 22,
                marginBottom: 10,
                borderWidth: videoError ? 2 : 1,
                borderColor: videoError ? tailwindColors.warn : tailwindColors.outline,
                backgroundColor: videoAsset
                  ? isDark
                    ? "#1e253c"
                    : "#f3f4fd"
                  : isDark
                    ? tailwindColors.card
                    : tailwindColors.cardAccent
              }}
              textStyle={{
                color: videoError
                  ? tailwindColors.warn
                  : isDark
                    ? tailwindColors.info
                    : "#84cbf7",
                fontWeight: videoAsset ? "bold" : "600",
                fontSize: 16,
              }}
              iconRight={videoAsset ? <Ionicons name="checkmark-circle" size={20} color={tailwindColors.info} /> : undefined}
            />
            {videoAsset && (
              <View style={{ marginTop: 7, marginBottom: 6 }}>
                <UploadPreview asset={videoAsset} />
                <TouchableOpacity
                  onPress={handleRemoveVideo}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Ionicons name="close-circle" color={tailwindColors.warn} size={22} />
                  <Text style={{ color: tailwindColors.warn, marginLeft: 5, fontSize: 13 }}>
                    Remove Video
                  </Text>
                </TouchableOpacity>
                <View className="mt-2 flex-row items-center bg-surface dark:bg-dark-surface p-3 rounded-xl border border-border dark:border-dark-border">
                  <Ionicons name="videocam" size={20} color={tailwindColors.link} style={{ marginRight: 8 }} />
                  <View className="flex-1">
                    <Text style={{
                      color: tailwindColors.text,
                      fontSize: 15,
                      fontWeight: "bold"
                    }}>
                      {videoAsset.fileName || videoAsset.name || 'Video selected'}
                    </Text>
                    {videoAsset.duration && (
                      <Text style={{
                        color: tailwindColors.textSecondary,
                        marginTop: 4,
                        fontSize: 11.5
                      }}>
                        Duration: {Math.round(videoAsset.duration)}s
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
            {videoError && (
              <Text style={{
                color: tailwindColors.warn,
                marginBottom: 4,
                marginTop: 0,
                fontSize: 13
              }}>{videoError}</Text>
            )}

            {/* Info message when no video */}
            {!videoAsset && (
              <View style={{
                marginTop: 10,
                marginBottom: 2,
                padding: 15,
                backgroundColor: isDark ? tailwindColors.card : "#eff6ff",
                borderRadius: 12,
                borderColor: isDark ? tailwindColors.outline : "#b8daf8",
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
                <Ionicons name="information-circle" size={20} color={tailwindColors.link} style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: tailwindColors.text,
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 3,
                  }}>New Reel</Text>
                  <Text style={{
                    color: tailwindColors.link,
                    fontSize: 13,
                  }}>
                    Select a video from your gallery to create an engaging reel. You can add an optional caption to describe your content.
                  </Text>
                </View>
              </View>
            )}

            {/* Publish button */}
            <View style={{
              marginTop: 30,
              marginBottom: 2,
              alignItems: 'center',
            }}>
              <AppButton
                title={loading ? 'Publishing...' : 'Publish Reel'}
                loading={loading}
                onPress={handlePublish}
                style={{
                  width: '90%',
                  backgroundColor: 'transparent',
                  borderRadius: 30,
                  shadowColor: tailwindColors.link,
                  shadowOpacity: 0.18,
                  shadowRadius: 7,
                  elevation: 3,
                  overflow: 'hidden'
                }}
                className="bg-gradient-to-r from-[#35bee2] to-[#4a62dd]"
                textStyle={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  letterSpacing: 1.3,
                  color: "#fff"
                }}
                iconLeft={<Ionicons name="play-circle-outline" color="#fff" size={22} />}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
