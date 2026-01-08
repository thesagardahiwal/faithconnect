import { AppwriteDocument } from './appwrite.types';

export type PostType = 'post' | 'reel';

export interface Post extends AppwriteDocument {
  leader: string;          // relationship → users_profile
  type: PostType;
  text?: string;
  mediaUrl: string;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
}
