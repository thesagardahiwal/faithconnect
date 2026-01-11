import { databases } from '@/lib/appwrite';
import { ID, Query } from "react-native-appwrite";

import { APPWRITE_CONFIG } from '@/config/appwrite';

export const commentService = {
    async fetchComments(postId: string) {
        return databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.comments,
            [
                Query.equal('post', postId),
                Query.orderAsc('$createdAt'),
            ]
        );
    },

    async addComment(postId: string, userId: string, text: string) {
        return databases.createDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.comments,
            ID.unique(),
            {
                post: postId,
                author: userId,
                text,
            }
        );
    },
};
