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
import { useUser } from '@/hooks/useUser';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CreatePost() {
  const router = useRouter();
  const { profile } = useUser();
  const { pickImage, upload } = useMedia();

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

  return (
    <Screen>
      <Header title="Share Inspiration" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{flex: 1}}
        keyboardVerticalOffset={90}
      >
        <View style={{
          marginHorizontal: 20, 
          marginTop: 24, 
          marginBottom: 8, 
          backgroundColor: '#22244d',
          borderRadius: 18, 
          padding: 22,
          shadowColor: '#3b33b4',
          shadowOpacity: 0.19,
          shadowRadius: 6,
          elevation: 4,
        }}>
          <View style={{flexDirection:'row', alignItems:'center', marginBottom: 10}}>
            <Ionicons name="bulb-outline" size={28} color="#fcd34d" />
            <Text style={{
              fontWeight: '700',
              fontSize: 20,
              color: '#fff',
              marginLeft: 10,
              letterSpacing: 0.2
            }}>
              Inspire your followers!
            </Text>
          </View>
          <Text style={{
            color:'#dbeafe',
            fontSize: 15,
            marginBottom: 20,
            opacity:0.8,
          }}>
            Share a thoughtful message, scripture, or a beautiful moment.
          </Text>

          <View style={{ marginBottom: 4 }}>
            <AppInput
              label={
                <Text>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Message </Text>
                  <Text style={{ color: "#81e1ff", fontWeight: "400", fontSize: 13 }}>
                    (required if no image)
                  </Text>
                </Text>
              }
              value={text}
              onChangeText={handleTextChange}
              placeholder="Write something inspiring..."
              multiline={true}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {textError ? (
                <Text style={{ color: '#ff374e', fontSize: 13, fontWeight: '600' }}>
                  {textError}
                </Text>
              ) : (
                <Text style={{
                  color: text.length > 400 ? '#f59e42' : '#acacad',
                  fontSize: 12,
                  alignSelf: 'flex-end',
                  fontVariant: ['tabular-nums'],
                  letterSpacing: 0.3,
                  fontWeight: text.length > 450 ? 'bold' : '500'
                }}>
                  {text.length}/500
                </Text>
              )}
              {/* Visual indicator bar for character count */}
              <View style={{
                flex: 1,
                height: 6,
                marginLeft: 12,
                backgroundColor: '#2d3157',
                borderRadius: 5,
                overflow: 'hidden',
              }}>
                <View style={{
                  width: `${Math.min(100, (text.length/500)*100)}%` as any,
                  height: '100%' as any,
                  backgroundColor:
                    text.length < 400
                      ? '#67e8f9'
                      : text.length <= 500
                      ? '#f59e42'
                      : '#ff4764',
                  borderRadius: 4,
                  // Removed unsupported 'transition' property
                }}/>
              </View>
            </View>
          </View>

          <MediaPicker
            label={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                <MaterialCommunityIcons name="image-plus" size={26} color="#7ecddd" />
                <Text style={{ color:'#84cbf7', fontSize: 16, fontWeight: '600' }}>
                  {imageAsset ? 'Change Image' : 'Add Image (optional)'}
                </Text>
              </View>
            }
            onPick={handlePickImage}
            style={{
              marginTop: 22,
              marginBottom: 10,
              borderWidth: imageError ? 2 : 1,
              borderColor: imageError ? '#ff374e' : undefined,
              backgroundColor: imageAsset ? '#1b183a' : undefined,
            }}
            textStyle={{
              color: imageError ? '#ff374e' : '#84cbf7',
              fontWeight: imageAsset ? 'bold' : '600',
              fontSize: 16,
            }}
            iconRight={imageAsset ? <Ionicons name="checkmark-circle" size={20} color="#67e8f9" /> : undefined}
          />
          {/* FIX: MediaPicker remains always enabled regardless of text value */}
          {imageAsset && (
            <View style={{ marginTop: 7, marginBottom: 6 }}>
              <UploadPreview asset={imageAsset} />
              <TouchableOpacity
                onPress={handleRemoveImage}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent:'flex-end'
                }}
              >
                <Ionicons name="close-circle" color="#fa6565" size={22} />
                <Text style={{ color:'#fa6565', marginLeft: 5, fontSize:13 }}>
                  Remove Image
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {imageError && (
            <Text style={{color:'#ff374e', marginBottom:4, marginTop:0, fontSize: 13}}>{imageError}</Text>
          )}

          <View style={{
            marginTop: 33,
            marginBottom: 2,
            alignItems: 'center',
          }}>
            <AppButton
              title={loading ? 'Publishing...' : 'Publish Post'}
              loading={loading}
              onPress={handlePublish}
              style={{
                width: '90%',
                backgroundColor: 'linear-gradient(90deg,#4a35df,#784ebc)',
                shadowColor: '#544bec',
                shadowOpacity:0.26,
                shadowRadius: 8,
                elevation: 3,
                borderRadius: 30
              }}
              textStyle={{
                fontWeight: 'bold',
                fontSize: 18,
                letterSpacing: 1.3,
              }}
              iconLeft={<Ionicons name="send" color="#fff" size={22} />}
              disabled={loading}
            />
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 26, 
            marginTop: 4,
            alignItems: 'center',
        }}>
          <Text style={{
            color:'#b2b8ee',
            textAlign:'center',
            marginTop:5,
            marginBottom:18,
            fontSize:13.3,
            opacity:0.85,
          }}>
            Your post will reach your followers instantly and motivate them in their journey.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
