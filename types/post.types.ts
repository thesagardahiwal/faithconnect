import { AppwriteDocument } from './appwrite.types';
import { UserProfile } from './user.types';

export type PostType = 'post' | 'reel';

export interface Post extends AppwriteDocument {
  leader: string | UserProfile;          // relationship → users_profile
  type: PostType;
  text?: string;
  mediaUrl: string;
  likesCount?: number;
  commentsCount?: number;
}
