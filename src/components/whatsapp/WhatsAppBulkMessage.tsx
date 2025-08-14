import React, { useState } from 'react';
import { Send, Plus, Trash } from 'lucide-react';
import { whatsappService } from '../../services/whatsapp';

interface Contact {
  id: string;
  name: string;
  number: string;
}

export default function WhatsAppBulkMessage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [message, setMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [template, setTemplate] = useState('');
  const [sending, setSending] = useState(false);

  const handleAddContact = () => {
    setContacts([...contacts, { id: Date.now().toString(), name: '', number: '' }]);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleContactChange = (id: string, field: 'name' | 'number', value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const handleSend = async () => {
    if (!message.trim() || contacts.length === 0) return;

    try {
      setSending(true);
      const numbers = contacts.map(contact => contact.number);
      await whatsappService.sendBulkMessage(numbers, message);
      setMessage('');
      // Show success notification
    } catch (error) {
      console.error('Failed to send messages:', error);
      // Show error notification
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Bulk Message</h2>

      {/* Contacts List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Recipients</h3>
          <button
            onClick={handleAddContact}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </button>
        </div>
        
        <div className="space-y-2">
          {contacts.map(contact => (
            <div key={contact.id} className="flex space-x-2">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Number"
                value={contact.number}
                onChange={(e) => handleContactChange(contact.id, 'number', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Message Template */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message Template
        </label>
        <select
          value={template}
          onChange={(e) => {
            setTemplate(e.target.value);
            if (e.target.value) {
              setMessage(e.target.value); // In real app, this would load the template content
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Template</option>
          <option value="greeting">Greeting</option>
          <option value="reminder">Payment Reminder</option>
          <option value="update">Status Update</option>
        </select>
      </div>

      {/* Message Content */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Type your message..."
        />
      </div>

      {/* Schedule */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Schedule (Optional)
        </label>
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={sending || !message.trim() || contacts.length === 0}
        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {sending ? 'Sending...' : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </>
        )}
      </button>
    </div>
  );
}