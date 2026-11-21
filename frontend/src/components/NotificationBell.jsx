import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  ShoppingBag,
  ExternalLink,
  X
} from 'lucide-react';
import './NotificationBell.css';

// Format timestamp into clean relative or local time
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'pending':
      return <Clock size={16} className="notif-type-icon icon-pending" />;
    case 'accepted':
      return <CheckCircle2 size={16} className="notif-type-icon icon-accepted" />;
    case 'preparing':
      return <Flame size={16} className="notif-type-icon icon-preparing" />;
    case 'ready':
      return <Sparkles size={16} className="notif-type-icon icon-ready" />;
    case 'completed':
      return <CheckCheck size={16} className="notif-type-icon icon-completed" />;
    default:
      return <ShoppingBag size={16} className="notif-type-icon icon-default" />;
  }
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.orderNumber) {
      navigate(`/track/${item.orderNumber}`);
    } else {
      navigate('/orders');
    }
  };

  return (
    <div className="notification-bell-wrapper" ref={panelRef}>
      {/* Bell Button */}
      <button
        type="button"
        className={`notification-bell-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Notifications"
        aria-label={`View Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notification-dropdown-panel card" role="region" aria-label="Notifications panel">
          {/* Header */}
          <div className="notif-header">
            <div className="notif-header-title">
              <span className="notif-heading">Notifications</span>
              {unreadCount > 0 && (
                <span className="notif-unread-pill">{unreadCount} New</span>
              )}
            </div>

            {notifications.length > 0 && unreadCount > 0 && (
              <button
                type="button"
                className="notif-mark-read-btn"
                onClick={markAllAsRead}
                title="Mark all notifications as read"
              >
                <CheckCheck size={14} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="notif-list-container">
            {notifications.length === 0 ? (
              <div className="notif-empty-state">
                <div className="empty-bell-circle">
                  <Bell size={26} />
                </div>
                <h4 className="empty-title">No notifications yet</h4>
                <p className="empty-subtitle">
                  Live updates about your orders (accepted, cooking, ready for pickup) will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`notif-item ${!item.read ? 'unread' : 'read'}`}
                  onClick={() => handleNotificationClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleNotificationClick(item);
                    }
                  }}
                >
                  <div className={`notif-icon-box notif-icon-${item.type}`}>
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="notif-content">
                    <div className="notif-top-row">
                      <span className="notif-title">{item.title}</span>
                      <span className="notif-time">{formatTimeAgo(item.timestamp)}</span>
                    </div>
                    <p className="notif-message">{item.message}</p>
                    <span className="notif-track-hint">
                      Track Order #{item.orderNumber} <ExternalLink size={11} />
                    </span>
                  </div>

                  {!item.read && <span className="unread-dot" title="Unread" />}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notif-footer">
              <button
                type="button"
                className="notif-view-all-btn"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/orders');
                }}
              >
                View My Orders & History
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
