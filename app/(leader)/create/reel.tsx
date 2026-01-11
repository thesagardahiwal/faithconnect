import Header from '@/components/common/Header';
import Screen from '@/components/common/Screen';
import { MediaPicker } from '@/components/media/MediaPicker';
import { UploadPreview } from '@/components/media/UploadPreview';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { APPWRITE_CONFIG } from '@/config/appwrite';
import { useMedia } from '@/hooks/useMedia';
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

  const [text, setText] = useState('');
  const [videoAsset, setVideoAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Enhanced validation states and UX like the post creator
  const [textError, setTextError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

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
          commentsCount: 0,
        }
      );

      setText('');
      setVideoAsset(null);

      // Success alert
      Alert.alert('Success', 'Reel published successfully!', [
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
        style={{flex: 1}}
        keyboardVerticalOffset={90}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Header title="New Reel" />

          {/* Enhanced guidance */}
          <View
            style={{
              marginHorizontal: 20, 
              marginTop: 24, 
              marginBottom: 8, 
              backgroundColor: '#20224c',
              borderRadius: 17, 
              padding: 22,
              shadowColor: '#4066c9',
              shadowOpacity: 0.14,
              shadowRadius: 5,
              elevation: 3,
            }}>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom: 10}}>
              <MaterialCommunityIcons name="movie-open-outline" size={28} color="#67e8f9" />
              <Text style={{
                fontWeight: '700',
                fontSize: 20,
                color: '#fff',
                marginLeft: 10,
                letterSpacing: 0.2
              }}>
                Share a Reel Moment!
              </Text>
            </View>
            <Text style={{
              color:'#dbeafe',
              fontSize: 15,
              marginBottom: 18,
              opacity:0.8,
            }}>
              Select a fun or powerful video to inspire, teach, or uplift your followers. Add a brief caption (optional).
            </Text>

            {/* Caption input */}
            <View style={{ marginBottom: 8 }}>
              <AppInput
                label={
                  <Text>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Caption </Text>
                    <Text style={{ color: "#81e1ff", fontWeight: "400", fontSize: 13 }}>
                      (optional, max 300 chars)
                    </Text>
                  </Text>
                }
                value={text}
                onChangeText={handleTextChange}
                placeholder="Add a caption to your reel..."
                multiline={true}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {textError ? (
                  <Text style={{ color: '#ff374e', fontSize: 13, fontWeight: '600' }}>
                    {textError}
                  </Text>
                ) : (
                  <Text style={{
                    color: text.length > 250 ? '#f59e42' : '#acacad',
                    fontSize: 12,
                    alignSelf: 'flex-end',
                    fontVariant: ['tabular-nums'],
                    letterSpacing: 0.3,
                    fontWeight: text.length > 270 ? 'bold' : '500'
                  }}>
                    {text.length}/300
                  </Text>
                )}
                <View style={{
                  flex: 1,
                  height: 6,
                  marginLeft: 12,
                  backgroundColor: '#2d3157',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    width: `${Math.min(100, (text.length/300)*100)}%`,
                    height: '100%',
                    backgroundColor:
                      text.length < 250
                        ? '#67e8f9'
                        : text.length <= 300
                        ? '#f59e42'
                        : '#ff4764',
                    borderRadius: 4,
                  }}/>
                </View>
              </View>
            </View>

            {/* Video picker */}
            <MediaPicker
              label={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                  <MaterialCommunityIcons name="video-plus" size={26} color="#7ecddd" />
                  <Text style={{ color:'#84cbf7', fontSize: 16, fontWeight: '600' }}>
                    {videoAsset ? 'Change Video' : 'Add Video (required)'}
                  </Text>
                </View>
              }
              onPick={handlePickVideo}
              style={{
                marginTop: 22,
                marginBottom: 10,
                borderWidth: videoError ? 2 : 1,
                borderColor: videoError ? '#ff374e' : undefined,
                backgroundColor: videoAsset ? '#181733' : undefined,
              }}
              textStyle={{
                color: videoError ? '#ff374e' : '#84cbf7',
                fontWeight: videoAsset ? 'bold' : '600',
                fontSize: 16,
              }}
              iconRight={videoAsset ? <Ionicons name="checkmark-circle" size={20} color="#67e8f9" /> : undefined}
            />
            {videoAsset && (
              <View style={{ marginTop: 7, marginBottom: 6 }}>
                <UploadPreview asset={videoAsset} />
                <TouchableOpacity
                  onPress={handleRemoveVideo}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent:'flex-end'
                  }}
                >
                  <Ionicons name="close-circle" color="#fa6565" size={22} />
                  <Text style={{ color:'#fa6565', marginLeft: 5, fontSize:13 }}>
                    Remove Video
                  </Text>
                </TouchableOpacity>
                <View className="mt-2 flex-row items-center bg-surface dark:bg-dark-surface p-3 rounded-xl border border-border dark:border-dark-border">
                  <Ionicons name="videocam" size={20} color="#2667c9" style={{ marginRight: 8 }} />
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                      {videoAsset.fileName || videoAsset.name || 'Video selected'}
                    </Text>
                    {videoAsset.duration && (
                      <Text className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                        Duration: {Math.round(videoAsset.duration)}s
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
            {videoError && (
              <Text style={{color:'#ff374e', marginBottom:4, marginTop:0, fontSize: 13}}>{videoError}</Text>
            )}

            {/* Info message when no video */}
            {!videoAsset && (
              <View style={{
                marginTop: 10,
                marginBottom: 2,
                padding: 15,
                backgroundColor: '#eff6ff',
                borderRadius: 12,
                borderColor: '#b8daf8',
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
                <Ionicons name="information-circle" size={20} color="#2667c9" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color:'#1e293b',
                    fontSize:15,
                    fontWeight:'bold',
                    marginBottom:3,
                  }}>New Reel</Text>
                  <Text style={{
                    color:'#2563eb',
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
                  backgroundColor: 'linear-gradient(90deg,#35bee2,#4a62dd)',
                  shadowColor: '#4066c9',
                  shadowOpacity:0.18,
                  shadowRadius: 7,
                  elevation: 3,
                  borderRadius: 30
                }}
                textStyle={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  letterSpacing: 1.3,
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
