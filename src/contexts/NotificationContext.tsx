import { createContext, useContext, useMemo, useState } from 'react';
import { demoNotifications } from '../data/demoData';
import type { NotificationItem } from '../types';

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState(demoNotifications);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAllRead: () => setNotifications((items) => items.map((item) => ({ ...item, read: true }))),
    }),
    [notifications, unreadCount],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used inside NotificationProvider');
  return context;
};
