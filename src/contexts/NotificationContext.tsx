import { createContext, useContext, useMemo, useState } from 'react';
import type { NotificationItem } from '../types';

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, 'id' | 'read'>) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification: (item: Omit<NotificationItem, 'id' | 'read'>) => {
        setNotifications((items) => [
          { ...item, id: crypto.randomUUID(), read: false },
          ...items,
        ]);
      },
      markAllRead: () => setNotifications((items) => items.map((item) => ({ ...item, read: true }))),
    }),
    [notifications, unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used inside NotificationProvider');
  return context;
};
