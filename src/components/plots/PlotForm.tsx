import React, { useState } from 'react';
import { MapPin, Users, Plane as Plant } from 'lucide-react';

interface PlotFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function PlotForm({ onSubmit, initialData }: PlotFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    size: '',
    location: '',
    soilType: '',
    irrigationType: '',
    description: '',
    coordinates: { latitude: '', longitude: '' },
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Plot Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Size (acres)</label>
          <input
            type="number"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Soil Type</label>
          <select
            value={formData.soilType}
            onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select Soil Type</option>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="silt">Silt</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Irrigation Type</label>
          <input
            type="text"
            value={formData.irrigationType}
            onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="text"
            value={formData.coordinates.latitude}
            onChange={(e) => setFormData({
              ...formData,
              coordinates: { ...formData.coordinates, latitude: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="text"
            value={formData.coordinates.longitude}
            onChange={(e) => setFormData({
              ...formData,
              coordinates: { ...formData.coordinates, longitude: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-green-600 rounded border-gray-300"
        />
        <label className="ml-2 text-sm text-gray-700">Active Plot</label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {initialData ? 'Update Plot' : 'Add Plot'}
        </button>
      </div>
    </form>
  );
}