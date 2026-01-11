import { getItem, setItem } from '@/lib/manageStorage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadExploreFeed, loadReelsFeed } from '@/store/slices/post.slice';
import { Post } from '@/types/post.types';
import { useCallback, useEffect, useState } from 'react';

const CACHE_KEY_EXPLORE = 'explore_feed_cache';
const CACHE_KEY_REELS = 'reels_feed_cache';

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const { explore, reels, exploreLoading, reelsLoading } = useAppSelector((state) => state.posts);
  const [cachedExplore, setCachedExplore] = useState<Post[]>([]);
  const [cachedReels, setCachedReels] = useState<Post[]>([]);

  // Load cached explore feed on mount, don't block UI for data fetch
  useEffect(() => {
    const fetchCached = async () => {
      const cachedExploreFeed = await getItem(CACHE_KEY_EXPLORE);
      const cachedReelsFeed = await getItem(CACHE_KEY_REELS);
      if (cachedExploreFeed) setCachedExplore(cachedExploreFeed);
      if (cachedReelsFeed) setCachedReels(cachedReelsFeed);
    };
    fetchCached();
  }, []);

  // Whenever explore or reels updates from Redux (api fetch), update cache
  useEffect(() => {
    if (explore && Array.isArray(explore)) {
      setItem(CACHE_KEY_EXPLORE, explore);
      setCachedExplore(explore);
    }
  }, [explore]);
  useEffect(() => {
    if (reels && Array.isArray(reels)) {
      setItem(CACHE_KEY_REELS, reels);
      setCachedReels(reels);
    }
  }, [reels]);

  // Loads explore feed, always triggers remote fetch via redux thunk
  const loadExplore = useCallback(() => {
    dispatch(loadExploreFeed());
  }, [dispatch]);

  // Loads reels feed, always triggers remote fetch via redux thunk
  const loadReels = useCallback(() => {
    dispatch(loadReelsFeed());
  }, [dispatch]);

  // Until Redux has new explore/reels, show cached, else show redux
  return {
    explore: explore && explore.length > 0 ? explore : cachedExplore,
    reels: reels && reels.length > 0 ? reels : cachedReels,
    loadExplore,
    loadReels,
    exploreLoading,
    reelsLoading,
  };
};
