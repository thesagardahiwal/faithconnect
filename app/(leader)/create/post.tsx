import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { MediaPicker } from '@/components/media/MediaPicker';
import { UploadPreview } from '@/components/media/UploadPreview';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';

import { useMedia } from '@/hooks/useMedia';
import { databases } from '@/lib/appwrite';
import { ID } from "react-native-appwrite";

import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CreatePost() {
  const router = useRouter();
  const { profile } = useUser();
  const { pickImage, upload } = useMedia();
  const { isDark } = useTheme();

  const [text, setText] = useState('');
  const [imageAsset, setImageAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Validation states
  const [textError, setTextError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // --- FIX: Always clear image error when picking or typing ---
  const validateInput = () => {
    let valid = true;
    setTextError(null);
    setImageError(null);

    if (!text && !imageAsset) {
      setTextError('Please enter a message or select an image to post.');
      setImageError('Please enter a message or select an image to post.');
      valid = false;
    } else if (text) {
      if (text.trim().length < 3) {
        setTextError('Message is too short (min. 3 characters).');
        valid = false;
      } else if (text.length > 500) {
        setTextError('Message is too long (max. 500 characters).');
        valid = false;
      }
    }
    return valid;
  };

  // FIX: explicitly allow user to pick/change image even if text is entered first
  const handlePickImage = async () => {
    const asset = await pickImage();
    if (asset) {
      setImageAsset(asset);
      setImageError(null); // Clear error
    }
  };

  const handleRemoveImage = () => {
    setImageAsset(null);
    setImageError(null);
  };

  // FIX: Allow typing to not block MediaPicker; always clear imageError if typing fixes requirement
  const handleTextChange = (msg: string) => {
    setText(msg);
    if (textError) setTextError(null); // Clear error while typing
    if (imageError && (msg.trim().length > 0 || imageAsset)) setImageError(null);
  };

  const handlePublish = async () => {
    if (!validateInput()) return;

    if (!profile) {
      Alert.alert('Not signed in', 'Please sign in to publish a post.');
      return;
    }

    try {
      setLoading(true);

      let mediaFileId: string | null = null;

      // Upload image if present
      if (imageAsset) {
        mediaFileId = await upload(imageAsset, 'image');
      }

      // Create post document
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.posts,
        ID.unique(),
        {
          leader: profile.$id,
          type: 'post',
          text: text || '',
          mediaUrl: mediaFileId, // can be null
          likesCount: 0,
        }
      );

      setText('');
      setImageAsset(null);

      // Success alert
      Alert.alert('Posted!', 'Your post has been published.', [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  // Colors from tailwind config for runtime use (for custom stuff like progress bar):
  const tailwindColors = {
    background: isDark ? "#0F172A" : "#F9FAFB",
    card: isDark ? "#111827" : "#FFFFFF",
    cardAccent: isDark ? "#1E293B" : "#22244d", // fallback, use dark surface for dark, themed for light
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

  return (
    <Screen>
      <Header title="Share Inspiration" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{flex: 1}}
        keyboardVerticalOffset={90}
      >
        <View
          className={`
            mt-6 mb-2 rounded-2xl px-5 pt-6 pb-6
            ${isDark ? "bg-dark-surface" : "bg-primary-soft"}
            shadow-md
          `}
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
          }}
        >
          <View className="flex-row items-center mb-2.5">
            <Ionicons name="bulb-outline" size={28} color={tailwindColors.accent} />
            <Text className="font-bold text-xl ml-2 tracking-wider"
              style={{
                color: tailwindColors.text,
                letterSpacing: 0.2
              }}
            >
              Inspire your followers!
            </Text>
          </View>
          <Text
            className={`mb-5 text-[15px] className='text-primary-soft dark:text-dark-primary`}
          >
            Share a thoughtful message, scripture, or a beautiful moment.
          </Text>

          <View className="mb-1">
            <AppInput
              label={
                <Text>
                  <Text
                    className={`${isDark ? "text-dark-text-primary" : "text-text-primary"} font-semibold`}
                    style={{ color: tailwindColors.text, fontWeight: "600" }}
                  >
                    Message{' '}
                  </Text>
                  <Text
                    className={`text-xs`}
                    style={{
                      color: tailwindColors.info,
                      fontWeight: "400"
                    }}
                  >
                    (required if no image)
                  </Text>
                </Text>
              }
              value={text}
              onChangeText={handleTextChange}
              placeholder="Write something inspiring..."
              multiline={true}
              className={`text-base ${isDark ? "text-dark-text-primary bg-dark-background" : "text-text-primary bg-background"}`}
            />
            <View className="flex-row items-center justify-between">
              {textError ? (
                <Text className="text-error font-semibold text-xs">
                  {textError}
                </Text>
              ) : (
                <Text
                  className="text-xs font-medium"
                  style={{
                    color: text.length > 400
                      ? tailwindColors.attention
                      : tailwindColors.textSecondary,
                    fontWeight: text.length > 450 ? 'bold' : '500',
                    letterSpacing: 0.3,
                    fontVariant: ['tabular-nums'],
                    alignSelf: 'flex-end'
                  }}
                >
                  {text.length}/500
                </Text>
              )}
              {/* Visual indicator bar for character count */}
              <View
                className={`${isDark ? "bg-dark-background" : "bg-background"} flex-1 h-[6px] ml-3 rounded-lg overflow-hidden`}
              >
                <View
                  style={{
                    width: `${Math.min(100, (text.length/500)*100)}%`,
                    height: '100%',
                    backgroundColor:
                      text.length < 400
                        ? "#67e8f9"
                        : text.length <= 500
                        ? tailwindColors.attention
                        : tailwindColors.warn,
                    borderRadius: 4
                  }}
                />
              </View>
            </View>
          </View>

          <MediaPicker
            label={
              <View className="flex-row items-center gap-2.5">
                <MaterialCommunityIcons name="image-plus" size={26} color={isDark ? "#67e8f9" : "#7ecddd"} />
                <Text
                  className="font-semibold text-base"
                  style={{
                    color: imageError
                      ? tailwindColors.warn
                      : isDark
                        ? "#67e8f9"
                        : "#84cbf7",
                    fontWeight: imageAsset ? "bold" : "600",
                  }}
                >
                  {imageAsset ? 'Change Image' : 'Add Image (optional)'}
                </Text>
              </View>
            }
            onPick={handlePickImage}
            style={{
              marginTop: 22,
              marginBottom: 10,
              borderWidth: imageError ? 2 : 1,
              borderColor: imageError ? tailwindColors.warn : tailwindColors.outline,
              backgroundColor: imageAsset
                ? isDark
                  ? "#1e253c"
                  : "#f3f4fd"
                : isDark
                  ? "#111827"
                  : "#fff"
            }}
            textStyle={{
              color: imageError
                ? tailwindColors.warn
                : isDark
                  ? "#67e8f9"
                  : "#84cbf7",
              fontWeight: imageAsset ? "bold" : "600",
              fontSize: 16,
            }}
            iconRight={
              imageAsset ?
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={isDark ? "#67e8f9" : "#67e8f9"}
                /> : undefined
            }
          />
          {imageAsset && (
            <View className="mt-2 mb-1.5">
              <UploadPreview asset={imageAsset} />
              <TouchableOpacity
                onPress={handleRemoveImage}
                className="flex-row items-center justify-end mt-1"
              >
                <Ionicons name="close-circle" color={tailwindColors.warn} size={22} />
                <Text className="ml-1.5 text-xs" style={{ color: tailwindColors.warn }}>
                  Remove Image
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {imageError && (
            <Text
              className="text-error text-xs mb-1"
              style={{
                marginTop: 0,
              }}
            >
              {imageError}
            </Text>
          )}

          <View className="mt-8 mb-0.5 items-center">
            <AppButton
              title={loading ? 'Publishing...' : 'Publish Post'}
              loading={loading}
              onPress={handlePublish}
              style={{
                width: '90%',
                backgroundColor: 'transparent', // use bg-gradient for AppButton, otherwise fallback
                borderRadius: 30,
                shadowColor: tailwindColors.link,
                shadowOpacity: 0.26,
                shadowRadius: 8,
                elevation: 3,
                overflow: 'hidden'
              }}
              className="bg-gradient-to-r from-[#4a35df] to-[#784ebc]"
              textStyle={{
                fontWeight: 'bold',
                fontSize: 18,
                letterSpacing: 1.3,
                color: "#fff"
              }}
              iconLeft={<Ionicons name="send" color="#fff" size={22} />}
              disabled={loading}
            />
          </View>
        </View>
        <View
          className="items-center"
          style={{
            marginHorizontal: 26,
            marginTop: 4,
          }}
        >
          <Text
            className="text-center text-sm mt-1 mb-4"
            style={{
              color: isDark ? "#b2b8ee" : "#5256a2",
              opacity: 0.85,
              fontSize: 13.3,
            }}
          >
            Your post will reach your followers instantly and motivate them in their journey.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
