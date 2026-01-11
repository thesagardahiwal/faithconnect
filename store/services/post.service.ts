import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { Query } from 'react-native-appwrite';

export const fetchExplorePosts = () =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.posts, [
    Query.equal('type', 'post'),
    Query.select([
      '*',          // all reel fields
      'leader.*',   // 👈 populate leader profile
      'comments.*', // 👈 populate comments
      "comments.author.*",
      'likes.*',    // 👈 populate likes
    ]),
    Query.orderDesc('$createdAt'),
  ]);

export const fetchReels = () =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.posts, [
    Query.equal('type', 'reel'),
    Query.select([
      '*',          // all reel fields
      'leader.*',   // 👈 populate leader profile
      'comments.*', // 👈 populate comments
      "comments.author.*",
      'likes.*',    // 👈 populate likes
    ]),
    Query.orderDesc('$createdAt'),
  ]);

/**
 * Fetch posts by leader ID
 */
export const fetchPostsByLeader = (leaderId: string) =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.posts, [
    Query.equal('leader', leaderId),
    Query.equal('type', 'post'),
    Query.select([
      '*',
      'leader.*',
      'comments.*', // 👈 populate comments
      "comments.author.*",
      'likes.*',    // 👈 populate likes
    ]),
    Query.orderDesc('$createdAt'),
  ]);

/**
 * Fetch reels by leader ID
 */
export const fetchReelsByLeader = (leaderId: string) =>
  databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.posts, [
    Query.equal('leader', leaderId),
    Query.equal('type', 'reel'),
    Query.select([
      '*',
      'leader.*',
      'comments.*', // 👈 populate comments
      "comments.author.*",
      'likes.*',    // 👈 populate likes
    ]),
    Query.orderDesc('$createdAt'),
  ]);


export const fetchPostById = (postId: string) => {
  return databases.getDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collections.posts,
    postId,
    [
      Query.select([
        "*",
        "leader.*",
        "comments.*", // 👈 populate comments
        "comments.author.*",
        "likes.*",    // 👈 populate likes
      ])
    ]
  );
}