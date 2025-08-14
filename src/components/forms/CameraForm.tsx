import React, { useState } from 'react';

interface CameraFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function CameraForm({ onSubmit, initialData }: CameraFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    location: '',
    type: '',
    resolution: '',
    storageCapacity: '',
    maintenanceSchedule: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Camera Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Camera Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select Type</option>
            <option value="PTZ">PTZ Camera</option>
            <option value="Fixed">Fixed Camera</option>
            <option value="Dome">Dome Camera</option>
            <option value="Bullet">Bullet Camera</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Resolution</label>
          <select
            value={formData.resolution}
            onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select Resolution</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="2K">2K</option>
            <option value="4K">4K</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Storage Capacity (GB)</label>
          <input
            type="number"
            value={formData.storageCapacity}
            onChange={(e) => setFormData({ ...formData, storageCapacity: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Maintenance Schedule</label>
          <input
            type="date"
            value={formData.maintenanceSchedule}
            onChange={(e) => setFormData({ ...formData, maintenanceSchedule: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {initialData ? 'Update Camera' : 'Add Camera'}
        </button>
      </div>
    </form>
  );
}