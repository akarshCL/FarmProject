import React, { useState } from 'react';
import { Plus, Edit2, Trash } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export default function WhatsAppTemplates() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Payment Reminder',
      content: 'Dear {name}, this is a reminder that payment of {amount} is due on {date}.',
      variables: ['name', 'amount', 'date']
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  const handleSave = (template: Template) => {
    if (template.id) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates([...templates, { ...template, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setCurrentTemplate(null);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Message Templates</h2>
        <button
          onClick={() => {
            setCurrentTemplate(null);
            setIsEditing(true);
          }}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Template
        </button>
      </div>

      <div className="space-y-4">
        {templates.map(template => (
          <div key={template.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{template.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setCurrentTemplate(template);
                    setIsEditing(true);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">{template.content}</p>
            <div className="flex flex-wrap gap-2">
              {template.variables.map(variable => (
                <span
                  key={variable}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentTemplate ? 'Edit Template' : 'New Template'}
            </h3>
            <TemplateForm
              template={currentTemplate}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setCurrentTemplate(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface TemplateFormProps {
  template: Template | null;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

function TemplateForm({ template, onSave, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    id: template?.id || '',
    name: template?.name || '',
    content: template?.content || '',
    variables: template?.variables || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Template);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Template Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Use {'{variable}'} for dynamic content
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Variables (comma-separated)
        </label>
        <input
          type="text"
          value={formData.variables.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            variables: e.target.value.split(',').map(v => v.trim()).filter(Boolean)
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Template
        </button>
      </div>
    </form>
  );
}