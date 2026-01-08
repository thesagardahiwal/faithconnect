import { AppwriteDocument } from './appwrite.types';

export interface Chat extends AppwriteDocument {
  worshiper: string;       // relationship → users_profile
  leader: string;          // relationship → users_profile
  lastMessage?: string;
  lastMessageAt?: string;
}
