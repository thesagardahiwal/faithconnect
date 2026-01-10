import { AppwriteDocument } from './appwrite.types';
import { UserProfile } from './user.types';

export interface Chat extends AppwriteDocument {
  worshiper: UserProfile;       // relationship → users_profile
  leader: UserProfile;          // relationship → users_profile
  lastMessage?: string;
  lastMessageAt?: string;
}
