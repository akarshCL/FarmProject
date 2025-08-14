import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'task' | 'meeting' | 'reminder';
}

export default function CalendarWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      time: '10:00 AM',
      date: 'Today',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Equipment Maintenance',
      time: '2:30 PM',
      date: 'Tomorrow',
      type: 'task'
    },
    {
      id: '3',
      title: 'Harvest Planning',
      time: '9:00 AM',
      date: 'Mar 31',
      type: 'reminder'
    }
  ]);

  const getEventStyle = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700"
      >
        <CalendarIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
          </div>
          <div className="max-h-96 overflow-y-auto p-4">
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-sm font-medium text-gray-600">{event.date}</div>
                    <div className="text-xs text-gray-500">{event.time}</div>
                  </div>
                  <div className={`flex-1 p-3 rounded-lg ${getEventStyle(event.type)}`}>
                    <div className="font-medium">{event.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add New Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}