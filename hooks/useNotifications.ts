import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadNotifications } from '@/store/slices/notification.slice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.notifications);

  const loadUserNotifications = (userId: string) => {
    dispatch(loadNotifications(userId));
  };

  return {
    notifications: list,
    loadUserNotifications,
  };
};
