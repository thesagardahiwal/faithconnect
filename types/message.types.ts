import { AppwriteDocument } from './appwrite.types';

export interface Message extends AppwriteDocument {
  chat: string;            // relationship → chats
  sender: string;          // relationship → users_profile
  text: string;
  createdAt: string;
}
