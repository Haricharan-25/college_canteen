import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getMyOrders } from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [notifications, setNotifications] = useState(() => {
    if (!userId) return [];
    try {
      const saved = localStorage.getItem(`campusbite_notifications_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  // Sync notifications with localStorage whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`campusbite_notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, userId]);

  // Load existing notifications if user switches
  useEffect(() => {
    if (userId) {
      try {
        const saved = localStorage.getItem(`campusbite_notifications_${userId}`);
        setNotifications(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [userId]);

  // Map order status to human-friendly notification details
  const createNotificationFromOrder = (order) => {
    const status = order.status || 'Pending';
    const orderNumber = order.orderNumber || `CB-${order.id}`;
    const notifId = `${order.id}_${status}`;

    let title = 'Order Update';
    let message = `Order #${orderNumber} status changed to ${status}.`;
    let type = 'info';

    switch (status.toLowerCase()) {
      case 'pending':
        title = 'Order Placed';
        message = `Order #${orderNumber} for ₹${Number(order.totalAmount || 0).toFixed(2)} has been received by the canteen.`;
        type = 'pending';
        break;
      case 'accepted':
        title = 'Order Accepted';
        message = `Kitchen staff accepted Order #${orderNumber} and queued it for preparation.`;
        type = 'accepted';
        break;
      case 'preparing':
        title = 'Food Being Prepared';
        message = `Your delicious canteen meal for Order #${orderNumber} is now being prepared!`;
        type = 'preparing';
        break;
      case 'ready':
        title = 'Ready for Collection!';
        message = `Order #${orderNumber} is hot & ready! Please collect it at Counter #1.`;
        type = 'ready';
        break;
      case 'completed':
        title = 'Order Completed';
        message = `Order #${orderNumber} has been picked up. Enjoy your meal!`;
        type = 'completed';
        break;
      default:
        break;
    }

    return {
      id: notifId,
      orderId: order.id,
      orderNumber,
      status,
      title,
      message,
      type,
      timestamp: order.updatedAt || order.createdAt || new Date().toISOString(),
      read: false,
    };
  };

  // Check actual orders and detect new status updates without duplicates
  const fetchAndCheckUpdates = useCallback(async () => {
    if (!userId || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const orders = await getMyOrders(userId);
      if (Array.isArray(orders) && orders.length > 0) {
        setNotifications((prevList) => {
          const existingMap = new Map(prevList.map((n) => [n.id, n]));
          const newEntries = [];

          // Sort orders by createdAt ascending so status progression appears in chronological order
          const sortedOrders = [...orders].sort(
            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          );

          for (const order of sortedOrders) {
            const notifId = `${order.id}_${order.status}`;
            if (!existingMap.has(notifId)) {
              // Brand new status transition detected!
              const newNotif = createNotificationFromOrder(order);
              newEntries.push(newNotif);
            }
          }

          if (newEntries.length === 0) {
            return prevList;
          }

          // Prepend newest notifications first
          const updated = [...newEntries.reverse(), ...prevList];
          return updated;
        });
      }
    } catch (err) {
      // Backend may be offline or unreachable during cold start; fail gracefully
      console.warn('Could not poll orders for notifications:', err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [userId]);

  // Periodic polling every 12 seconds when document is visible
  useEffect(() => {
    if (!userId) return;

    fetchAndCheckUpdates();

    const intervalId = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchAndCheckUpdates();
      }
    }, 12000);

    const handleFocus = () => {
      fetchAndCheckUpdates();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userId, fetchAndCheckUpdates]);

  // Actions
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    if (userId) {
      localStorage.removeItem(`campusbite_notifications_${userId}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        refreshNotifications: fetchAndCheckUpdates,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
