import { AppwriteDocument } from './appwrite.types';
import { Message } from './message.types';
import { UserProfile } from './user.types';

export interface Chat extends AppwriteDocument {
  worshiper: UserProfile;       // relationship → users_profile
  leader: UserProfile;          // relationship → users_profile
  lastMessage?: Message;
  lastMessageAt?: string;
}
