import { AppwriteDocument } from './appwrite.types';

export type NotificationType =
  | 'post'
  | 'reel'
  | 'message'
  | 'like'
  | 'comment'
  | 'follow';

export interface Notification extends AppwriteDocument {
  user: string;            // relationship → users_profile
  type: NotificationType;
  referenceId?: string;    // postId / chatId
  isRead?: boolean;
  createdAt: string;
}
