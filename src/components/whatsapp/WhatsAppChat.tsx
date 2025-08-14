import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { whatsappService } from '../../services/whatsapp';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

interface WhatsAppChatProps {
  contactNumber: string;
  contactName: string;
}

export default function WhatsAppChat({ contactNumber, contactName }: WhatsAppChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    whatsappService.onMessage((message) => {
      if (message.from === contactNumber) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: message.body,
          sender: 'them',
          timestamp: new Date()
        }]);
      }
    });
  }, [contactNumber]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await whatsappService.sendMessage(contactNumber, newMessage);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date()
      }]);
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">{contactName}</h3>
        <p className="text-sm text-gray-500">{contactNumber}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'me'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white px-4 py-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}