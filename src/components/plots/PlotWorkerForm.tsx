import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface PlotWorkerFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  employees: any[];
}

export default function PlotWorkerForm({ onSubmit, initialData, employees }: PlotWorkerFormProps) {
  const [formData, setFormData] = useState(initialData || {
    employeeId: '',
    role: '',
    assignedDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Employee</label>
        <select
          value={formData.employeeId}
          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Select Role</option>
          <option value="supervisor">Supervisor</option>
          <option value="worker">Worker</option>
          <option value="specialist">Specialist</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned Date</label>
          <input
            type="date"
            value={formData.assignedDate}
            onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-green-600 rounded border-gray-300"
        />
        <label className="ml-2 text-sm text-gray-700">Active Assignment</label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {initialData ? 'Update Assignment' : 'Assign Worker'}
        </button>
      </div>
    </form>
  );
}