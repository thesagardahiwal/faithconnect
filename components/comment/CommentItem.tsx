import { Comment } from '@/types/comment.types';
import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

export function CommentItem({ comment }: { comment: Comment }) {
    console.log(comment);
    return (
        <View className="flex-row px-4 py-2">
            <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center mr-3">
                {comment.author?.photoUrl ? (
                    <Image
                        source={{ uri: comment.author.photoUrl }}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                    />
                ) : (
                    <Ionicons name="person" size={16} />
                )}
            </View>

            <View className="flex-1">
                <Text className="font-semibold dark:text-dark-primary text-text-primary">
                    {comment.author?.name ?? 'User'}
                </Text>
                <Text className="text-text-secondary dark:text-dark-secondary text-sm">
                    {comment.text}
                </Text>
            </View>
        </View>
    );
}
