import { AppwriteDocument } from './appwrite.types';

export type UserRole = 'worshiper' | 'leader';

export interface UserProfile extends AppwriteDocument {
  userId: string;          // Appwrite Auth userId
  name: string;
  role: UserRole;
  faith: string;
  bio?: string;
  photoUrl?: string;
  createdAt: string;
}
