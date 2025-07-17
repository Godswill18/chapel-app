import React, { useState } from 'react';
import { Bell, Clock, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import Card from '../components/Card';

// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'info' | 'warning' | 'success' | 'prayer';
//   time: string;
//   read: boolean;
// }

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Weekly Service Reminder',
      message: 'Sunday service starts at 10:00 AM. Don\'t forget to bring your hymnal!',
      type: 'info',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Prayer Request Update',
      message: 'Your prayer request for healing has been added to this week\'s prayer list.',
      type: 'prayer',
      time: '4 hours ago',
      read: false
    },
    {
      id: '3',
      title: 'Voting Deadline Soon',
      message: 'Worker of the week voting ends tomorrow at midnight.',
      type: 'warning',
      time: '6 hours ago',
      read: true
    },
    {
      id: '4',
      title: 'New Announcement Posted',
      message: 'Check out the latest updates about our upcoming charity drive.',
      type: 'success',
      time: '1 day ago',
      read: true
    },
    {
      id: '5',
      title: 'Youth Group Meeting',
      message: 'Youth group meeting has been rescheduled to Friday 7:00 PM.',
      type: 'info',
      time: '2 days ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'prayer': return <Bell className="h-5 w-5 text-purple-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'prayer': return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with the latest chapel activities and announcements
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
            >
              Mark all as read
            </button>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Bell className="h-4 w-4" />
            <span>{unreadCount} unread</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">You're all caught up! Check back later for updates.</p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-l-4 ${getTypeColor(notification.type)} ${
                !notification.read ? 'ring-2 ring-blue-100 dark:ring-blue-900' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-semibold ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        !notification.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      } mb-2`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;