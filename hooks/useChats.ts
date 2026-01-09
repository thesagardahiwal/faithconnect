import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadChats } from '@/store/slices/chat.slice';

export const useChats = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.chats);

  const loadUserChats = (userId: string) => {
    dispatch(loadChats(userId));
  };

  return {
    chats: list,
    loadUserChats,
  };
};
