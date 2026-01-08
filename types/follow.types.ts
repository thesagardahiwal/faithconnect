import { AppwriteDocument } from './appwrite.types';

export interface Follow extends AppwriteDocument {
  worshiper: string;       // relationship → users_profile
  leader: string;          // relationship → users_profile
  createdAt: string;
}
