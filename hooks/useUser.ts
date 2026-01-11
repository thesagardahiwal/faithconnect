import { getItem, setItem } from '@/lib/manageStorage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile, updateProfile } from '@/store/slices/user.slice';
import { UserProfile } from '@/types/user.types';
import { useEffect, useState } from 'react';

const PROFILE_KEY = 'user_profile';
const PROFILE_ID_KEY = 'user_profile_id';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const [cachedProfile, setCachedProfile] = useState<UserProfile | null>(null);
  const [cachedProfileId, setCachedProfileId] = useState<string | null>(null);

  // Load cached profile and ID on mount
  useEffect(() => {
    const fetchCached = async () => {
      const cached = await getItem(PROFILE_KEY);
      const cachedId = await getItem(PROFILE_ID_KEY);
      if (cached) {
        setCachedProfile(cached);
      }
      if (cachedId) {
        setCachedProfileId(cachedId);
      }
    };
    fetchCached();
  }, []);

  // When profile updates from Redux (API fetch), update cache
  useEffect(() => {
    if (profile) {
      setCachedProfile(profile);
      setItem(PROFILE_KEY, profile);

      if (profile.$id) {
        setCachedProfileId(profile.$id);
        setItem(PROFILE_ID_KEY, profile.$id);
      }
    }
  }, [profile]);

  const loadProfile = (userId: string) => {
    dispatch(fetchUserProfile(userId));
  };

  const updateUserProfile = async (profileId: string, data: { name?: string; faith?: string; bio?: string; photoUrl?: string }) => {
    return dispatch(updateProfile({ profileId, data }));
  };

  // Prioritize active profile, then cached profile object, then just the cached ID
  const effectiveProfileId = profile?.$id || cachedProfile?.$id || cachedProfileId;

  // Return cached profile if Redux profile is not available yet
  return {
    profile: profile || cachedProfile,
    profileId: effectiveProfileId,
    loadProfile,
    updateUserProfile,
  };
};
