import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface InventoryMovementFormProps {
  onSubmit: (data: any) => void;
  currentStock: number;
  unit: string;
}

export default function InventoryMovementForm({ onSubmit, currentStock, unit }: InventoryMovementFormProps) {
  const [formData, setFormData] = useState({
    type: 'inward' as 'inward' | 'outward',
    quantity: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    reference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: Number(formData.quantity)
    });
  };

  const maxOutward = currentStock;
  const isValidQuantity = formData.type === 'outward' 
    ? Number(formData.quantity) <= maxOutward 
    : true;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">Current Stock</div>
        <div className="text-2xl font-bold text-gray-900">{currentStock} {unit}</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Movement Type</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'inward' })}
            className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 ${
              formData.type === 'inward'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <ArrowUp className="h-5 w-5" />
            <span>Inward (Stock In)</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'outward' })}
            className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 ${
              formData.type === 'outward'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <ArrowDown className="h-5 w-5" />
            <span>Outward (Stock Out)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className={`mt-1 block w-full rounded-md border px-3 py-2 ${
              !isValidQuantity ? 'border-red-300' : 'border-gray-300'
            }`}
            min="1"
            max={formData.type === 'outward' ? maxOutward : undefined}
            required
          />
          {formData.type === 'outward' && (
            <p className="mt-1 text-sm text-gray-500">
              Maximum available: {maxOutward} {unit}
            </p>
          )}
          {!isValidQuantity && (
            <p className="mt-1 text-sm text-red-600">
              Quantity cannot exceed current stock
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <select
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Select Reason</option>
          {formData.type === 'inward' ? (
            <>
              <option value="Purchase from vendor">Purchase from vendor</option>
              <option value="Return from field">Return from field</option>
              <option value="Transfer from other location">Transfer from other location</option>
              <option value="Initial stock">Initial stock</option>
              <option value="Other">Other</option>
            </>
          ) : (
            <>
              <option value="Used in field operations">Used in field operations</option>
              <option value="Sold to customer">Sold to customer</option>
              <option value="Transfer to other location">Transfer to other location</option>
              <option value="Damaged/Expired">Damaged/Expired</option>
              <option value="Other">Other</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reference (Optional)</label>
        <input
          type="text"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="PO number, work order, etc."
        />
      </div>

      {/* Preview */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Movement Preview</h4>
        <div className="text-sm text-blue-800">
          <div>Type: <span className="font-medium">{formData.type}</span></div>
          <div>Quantity: <span className="font-medium">{formData.quantity || 0} {unit}</span></div>
          <div>
            New Stock: <span className="font-medium">
              {formData.type === 'inward' 
                ? currentStock + Number(formData.quantity || 0)
                : currentStock - Number(formData.quantity || 0)
              } {unit}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={!isValidQuantity || !formData.quantity}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Record Movement
        </button>
      </div>
    </form>
  );
}