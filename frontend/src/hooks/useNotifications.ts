import { useState } from "react";

export type NotificationItem = {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
};

export default function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (message: string) => {
    const newNotification: NotificationItem = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  return { notifications, setNotifications, addNotification };
}
