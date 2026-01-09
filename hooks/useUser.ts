import { getItem } from '@/lib/manageStorage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile, updateProfile } from '@/store/slices/user.slice';
import { UserProfile } from '@/types/user.types';
import { useEffect, useState } from 'react';

const PROFILE_KEY = 'user_profile';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const [cachedProfile, setCachedProfile] = useState<UserProfile | null>(null);

  // Load cached profile on mount
  useEffect(() => {
    const fetchCached = async () => {
      const cached = await getItem(PROFILE_KEY);
      if (cached) {
        setCachedProfile(cached);
      }
    };
    fetchCached();
  }, []);

  // When profile updates from Redux (API fetch), update cache
  useEffect(() => {
    if (profile) {
      setCachedProfile(profile);
    }
  }, [profile]);

  const loadProfile = (userId: string) => {
    dispatch(fetchUserProfile(userId));
  };

  const updateUserProfile = async (profileId: string, data: { name?: string; faith?: string; bio?: string; photoUrl?: string }) => {
    return dispatch(updateProfile({ profileId, data }));
  };

  // Return cached profile if Redux profile is not available yet
  return {
    profile: profile || cachedProfile,
    loadProfile,
    updateUserProfile,
  };
};
