import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMyLeaders,
  fetchMyWorshipers,
  toggleFollow
} from '@/store/slices/follow.slice';

export const useFollows = () => {
  const dispatch = useAppDispatch();
  const { myLeaders, myWorshiper, loading, togglingLeaderId } = useAppSelector((state) => state.follows);

  const loadMyLeaders = (worshiperId: string) => {
    dispatch(fetchMyLeaders(worshiperId));
  };

  const loadMyWorshiper = (leaderId: string) => {
    dispatch(fetchMyWorshipers(leaderId));
  };

  const _toggleFollow = (worshiperId: string, leaderId: string) => {
    // Prevent multiple simultaneous toggle requests
    if (loading) {
      console.log('[useFollows] follow: already in progress, skipping');
      return;
    }
    
    if (!worshiperId || !leaderId) {
      console.error('[useFollows] follow: missing required IDs', { worshiperId, leaderId });
      return;
    }
    
    console.log('[useFollows] follow: start', { worshiperId, leaderId });
    dispatch(toggleFollow({ worshiperId, leaderId }))
      .then((result: any) => {
        if (result.type === 'follow/toggleFollow/fulfilled') {
          console.log('[useFollows] follow: success', result.payload);
        } else {
          console.error('[useFollows] follow: failed', result);
        }
      })
      .catch((error: any) => {
        console.error('[useFollows] follow: error', error);
      });
  };

  /**
   * Check if the passed leaderId is present in myLeaders.
   * @param leaderId string
   * @returns boolean
   */
  const isFollowed = (leaderId: string): boolean => {
    if (!leaderId || !Array.isArray(myLeaders) || myLeaders.length === 0) return false;
    
    // Handle both string IDs and object IDs (leader might be a string or object with $id)
    const res = myLeaders.some((follow) => {
      if (!follow || !follow.leader) return false;
      
      // If leader is a string, compare directly
      if (typeof follow.leader === 'string') {
        return follow.leader === leaderId;
      }
      
      // If leader is an object, compare $id (handle both plain objects and Appwrite document objects)
      if (typeof follow.leader === 'object') {
        const leaderObj = follow.leader as any;
        if (leaderObj.$id) {
          return leaderObj.$id === leaderId;
        }
        // Also check if the object itself has the ID as a property
        if (leaderObj === leaderId) {
          return true;
        }
      }
      
      return false;
    });

    return res;
  };

  /**
   * Check if a specific leader is currently being toggled
   */
  const isToggling = (leaderId: string): boolean => {
    return togglingLeaderId === leaderId && loading;
  };

  return {
    myLeaders,
    loading,
    togglingLeaderId,
    loadMyLeaders,
    loadMyWorshiper,
    _toggleFollow,
    myWorshiper,
    isFollowed,
    isToggling,
  };
};
