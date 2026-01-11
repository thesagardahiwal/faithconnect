import { AppwriteDocument } from './appwrite.types';

export interface Comment extends AppwriteDocument {
    post: string; // postId
    author: {
        $id: string;
        name: string;
        photoUrl?: string;
    };
    text: string;
}
