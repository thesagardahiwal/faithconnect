import { APPWRITE_CONFIG } from '@/config/appwrite';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'react-native-appwrite';

const DATABASE_ID = APPWRITE_CONFIG.databaseId;
const FOLLOWS_COLLECTION_ID = APPWRITE_CONFIG.collections.follows;

/**
 * Follow a leader
 */
export const followLeader = async (
  worshiperId: string,
  leaderId: string
) => {
  return databases.createDocument(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    ID.unique(),
    {
      worshiper: worshiperId,
      leader: leaderId,
    }
  );
};

/**
 * Unfollow a leader
 */
export const unfollowLeader = async (followId: string) => {
  return databases.deleteDocument(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    followId
  );
};

/**
 * Get leaders followed by worshiper
 */
export const getMyLeaders = async (worshiperId: string) => {
  return databases.listDocuments(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    [Query.equal('worshiper', worshiperId)]
  );
};

/**
 * Check if worshiper follows leader
 */
export const checkIsFollowing = async (
  worshiperId: string,
  leaderId: string
) => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    [
      Query.equal('worshiper', worshiperId),
      Query.equal('leader', leaderId),
    ]
  );

  return res.documents.length > 0 ? res.documents[0] : null;
};


export const fetchMyWorshipers = async (
  leaderId: string
) => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    FOLLOWS_COLLECTION_ID,
    [
      Query.equal('leader', leaderId),
      Query.select([
        "*",
        "worshiper.*"
      ])
    ]
  );

  return res.documents.length > 0 ? res.documents : []
}