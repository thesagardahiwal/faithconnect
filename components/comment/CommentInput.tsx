import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

export function CommentInput({ onSend }: { onSend: (text: string) => void }) {
    const [text, setText] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            className="border-t border-border bg-surface dark:bg-dark-surface"
        >
            <View className="flex-row items-center px-3 py-3 pb-8">
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Write a comment..."
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-text-primary dark:text-dark-text-primary text-base bg-bg-secondary dark:bg-dark-bg-secondary rounded-full px-4 py-2 mr-2"
                />
                <Pressable
                    onPress={() => {
                        onSend(text);
                        setText('');
                    }}
                    className="bg-primary/10 rounded-full p-2"
                >
                    <Ionicons name="send" size={20} color="#2667c9" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
