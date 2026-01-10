import { Chat } from '@/types/chat.types';
import { UserProfile } from '@/types/user.types';

export const getChatPartner = (
  chat: Chat,
  currentProfileId: string
): UserProfile => {
  return chat.worshiper.$id === currentProfileId
    ? chat.leader
    : chat.worshiper;
};

export const formatChatTime = (date?: string) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
