import { AppwriteDocument } from './appwrite.types';

export interface Like extends AppwriteDocument {
  user: string;            // relationship → users_profile
  post: string;            // relationship → posts
  createdAt: string;
}
