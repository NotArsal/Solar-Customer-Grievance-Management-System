import { useState, useEffect } from 'react';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/v1/notifications');
      setNotifications(res.data);
    } catch {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    setTimeout(fetchNotifications, 0);
    let intervalId;

    const startPolling = () => {
      intervalId = setInterval(fetchNotifications, 60000);
    };

    const stopPolling = () => {
      if (intervalId) clearInterval(intervalId);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopPolling();
      } else {
        fetchNotifications();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const markAsRead = async (id, ticketId) => {
    try {
      await api.patch(`/v1/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
      setIsOpen(false);
      if (ticketId) navigate(`/track?id=${ticketId}`);
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/v1/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-brand-ink-mute hover:text-brand-ink transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-brand-ink bg-brand-primary rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-brand-canvas rounded-lg shadow-level-2 border border-brand-hairline z-50 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-brand-hairline bg-brand-canvas-soft">
            <h3 className="font-semibold text-sm text-brand-ink">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-brand-ink-mute hover:text-brand-ink transition-colors">Mark all read</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-brand-ink-mute">No notifications</div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n._id} 
                  onClick={() => markAsRead(n._id, n.ticket_id)}
                  className={`p-3 border-b border-brand-hairline-cool cursor-pointer transition-colors ${!n.is_read ? 'bg-brand-canvas-soft' : 'bg-brand-canvas hover:bg-brand-canvas-soft'}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`pill-tag-green ${n.type === 'SLA_BREACH' ? 'bg-red-100 text-red-700' : ''}`}>
                      {n.type}
                    </span>
                    <span className="text-[10px] text-brand-ink-mute-2">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className={`mt-2 text-sm ${!n.is_read ? 'font-medium text-brand-ink' : 'text-brand-ink-mute'}`}>
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
