import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllLeaders,
  fetchLeaderProfile,
  fetchLeaderPosts,
  fetchLeaderReels,
  clearCurrentLeader,
} from '@/store/slices/leader.slice';
import { useCallback } from 'react';

export const useLeaders = () => {
  const dispatch = useAppDispatch();
  const {
    leaders,
    currentLeader,
    leaderPosts,
    leaderReels,
    loading,
    loadingProfile,
    loadingPosts,
    error,
  } = useAppSelector((state) => state.leaders);

  const loadAllLeaders = useCallback(() => {
    dispatch(fetchAllLeaders());
  }, [dispatch]);

  const loadLeaderProfile = useCallback(
    (leaderId: string) => {
      dispatch(fetchLeaderProfile(leaderId));
    },
    [dispatch]
  );

  const loadLeaderPosts = useCallback(
    (leaderId: string) => {
      dispatch(fetchLeaderPosts(leaderId));
    },
    [dispatch]
  );

  const loadLeaderReels = useCallback(
    (leaderId: string) => {
      dispatch(fetchLeaderReels(leaderId));
    },
    [dispatch]
  );

  const clearLeader = useCallback(() => {
    dispatch(clearCurrentLeader());
  }, [dispatch]);

  return {
    leaders,
    currentLeader,
    leaderPosts,
    leaderReels,
    loading,
    loadingProfile,
    loadingPosts,
    error,
    loadAllLeaders,
    loadLeaderProfile,
    loadLeaderPosts,
    loadLeaderReels,
    clearLeader,
  };
};
