import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Low Water Level',
      message: 'Water level in Plot A is below threshold',
      type: 'warning',
      time: '10 min ago'
    },
    {
      id: '2',
      title: 'Harvest Complete',
      message: 'Wheat harvest in Field B completed',
      type: 'success',
      time: '1 hour ago'
    },
    {
      id: '3',
      title: 'Equipment Maintenance',
      message: 'Tractor #3 due for maintenance',
      type: 'info',
      time: '2 hours ago'
    }
  ]);

  const getNotificationStyle = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-yellow-50 border-yellow-400';
      case 'success': return 'bg-green-50 border-green-400';
      case 'error': return 'bg-red-50 border-red-400';
      default: return 'bg-blue-50 border-blue-400';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-500 hover:text-gray-700"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border-l-4 ${getNotificationStyle(notification.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setNotifications([])}
            >
              Clear all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}