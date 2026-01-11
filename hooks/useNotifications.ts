import { APPWRITE_CONFIG } from '@/config/appwrite';
import { client } from '@/lib/appwrite';
import { notificationService } from '@/store/services/notification.service';
import { Notification } from '@/types/notification.types';
import { useEffect, useState } from 'react';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const load = async () => {
    if (!userId) return;
    try {
      const res = await notificationService.fetch(userId);
      setNotifications(res.documents);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  useEffect(() => {
    load();

    const unsubscribe = client.subscribe(
      `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.notifications}.documents`,
      (res) => {
        const payload = res.payload as unknown as Notification;
        if (payload?.to?.$id === userId) {
          setNotifications(prev => [payload, ...prev]);
        }
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(n => n.$id === notificationId ? { ...n, read: true } : n)
      );
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.warn("Failed to mark notification as read:", error);
      // Revert if needed, but for read status it's usually fine to stay read
    }
  };

  return {
    notifications,
    unreadCount,
    reload: load,
    markAsRead,
  };
}
