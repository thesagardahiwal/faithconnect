import { AppwriteDocument } from './appwrite.types';
import { Comment } from './comment.types';
import { Like } from './like.types';
import { UserProfile } from './user.types';

export type PostType = 'post' | 'reel';

export interface Post extends AppwriteDocument {
  leader: UserProfile;          // relationship → users_profile
  type: PostType;
  text?: string;
  mediaUrl: string;
  likesCount?: number;
  commentsCount?: number;
  comments: Comment[];
  likes: Like[];
}
