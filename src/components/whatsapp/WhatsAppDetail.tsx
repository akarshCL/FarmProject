import React from 'react';
import { MessageSquare, Users, Clock, Send } from 'lucide-react';

interface Message {
  id: string;
  contact: string;
  message: string;
  type: 'incoming' | 'outgoing';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export default function WhatsAppDetail() {
  const messages: Message[] = [
    {
      id: '1',
      contact: 'John Smith',
      message: 'Need update on Field A harvest schedule',
      type: 'incoming',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: '2',
      contact: 'Maria Garcia',
      message: 'Equipment maintenance completed',
      type: 'outgoing',
      timestamp: '11:15 AM',
      status: 'delivered'
    },
    {
      id: '3',
      contact: 'Raj Patel',
      message: 'Fertilizer delivery confirmed for tomorrow',
      type: 'incoming',
      timestamp: '12:00 PM',
      status: 'sent'
    }
  ];

  const getMessageStyle = (type: string) => {
    return type === 'incoming'
      ? 'bg-gray-100'
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">WhatsApp Communication</h1>
        <p className="text-gray-600">Manage your WhatsApp business messages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contacts</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold">5 min</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Messages Today</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <Send className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
          </div>
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="mt-4 space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="font-medium">John Smith</div>
                <div className="text-sm text-gray-500">Field Manager</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="font-medium">Maria Garcia</div>
                <div className="text-sm text-gray-500">Equipment Supervisor</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="font-medium">Raj Patel</div>
                <div className="text-sm text-gray-500">Supplier</div>
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          </div>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${getMessageStyle(message.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{message.contact}</div>
                    <div className="text-sm mt-1">{message.message}</div>
                  </div>
                  <div className="text-xs text-gray-500">{message.timestamp}</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Status: {message.status}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}