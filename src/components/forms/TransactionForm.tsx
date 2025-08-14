import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
}

interface TransactionItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

interface TransactionFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function TransactionForm({ onSubmit, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState(initialData || {
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: '',
    description: '',
    reference: '',
    vendor: '',
    paymentMethod: '',
    taxAmount: '',
    discountAmount: '',
    notes: '',
    documents: [],
    items: []
  });

  const [items, setItems] = useState<TransactionItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [showItemModal, setShowItemModal] = useState(false);

  // Get inventory items using CRUD hook
  const { items: inventoryItems, update: updateInventory } = useCRUD<InventoryItem>({
    module: 'inventory'
  });

  // Initialize with sample inventory data if empty
  useEffect(() => {
    if (inventoryItems.length === 0) {
      // This would normally be loaded from the backend
      const sampleItems: InventoryItem[] = [
        { id: '1', name: 'Wheat Seeds', category: 'Seeds', quantity: 100, unit: 'kg', price: 50 },
        { id: '2', name: 'Fertilizer NPK', category: 'Fertilizers', quantity: 200, unit: 'kg', price: 25 },
        { id: '3', name: 'Pesticide Spray', category: 'Pesticides', quantity: 50, unit: 'L', price: 150 },
        { id: '4', name: 'Hand Tools', category: 'Tools', quantity: 20, unit: 'units', price: 500 },
        { id: '5', name: 'Diesel Fuel', category: 'Fuel', quantity: 500, unit: 'L', price: 90 },
        { id: '6', name: 'Irrigation Pipes', category: 'Equipment', quantity: 100, unit: 'meters', price: 120 },
      ];
      // Set initial inventory data
    }
  }, [inventoryItems.length]);

  useEffect(() => {
    const itemsTotal = items.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(itemsTotal);
    
    const discount = Number(formData.discountAmount) || 0;
    const tax = Number(formData.taxAmount) || 0;
    const total = itemsTotal - discount + tax;
    
    setTotalBill(Math.max(0, total));
  }, [items, formData.discountAmount, formData.taxAmount]);

  const addItem = async (inventoryItem: InventoryItem, quantity: number) => {
    // Check if enough stock is available for expense transactions
    if (formData.type === 'expense' && quantity > inventoryItem.quantity) {
      alert(`Not enough stock available. Current stock: ${inventoryItem.quantity} ${inventoryItem.unit}`);
      return;
    }

    const newItem: TransactionItem = {
      id: Date.now().toString(),
      inventoryItemId: inventoryItem.id,
      name: inventoryItem.name,
      quantity,
      unit: inventoryItem.unit,
      price: inventoryItem.price,
      total: quantity * inventoryItem.price
    };

    setItems([...items, newItem]);
    setShowItemModal(false);

    // Update inventory automatically based on transaction type
    if (formData.type === 'expense') {
      // For expenses, reduce inventory (outward movement)
      const newQuantity = inventoryItem.quantity - quantity;
      await updateInventory(inventoryItem.id, {
        quantity: Math.max(0, newQuantity),
        lastUpdated: new Date().toISOString().split('T')[0],
        status: newQuantity === 0 ? 'out-of-stock' : 
                newQuantity <= (inventoryItem as any).reorderLevel ? 'low-stock' : 'in-stock'
      });
    } else if (formData.type === 'income') {
      // For income (sales), we might also reduce inventory
      const newQuantity = inventoryItem.quantity - quantity;
      await updateInventory(inventoryItem.id, {
        quantity: Math.max(0, newQuantity),
        lastUpdated: new Date().toISOString().split('T')[0],
        status: newQuantity === 0 ? 'out-of-stock' : 
                newQuantity <= (inventoryItem as any).reorderLevel ? 'low-stock' : 'in-stock'
      });
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  };

  const updateItemPrice = (itemId: string, price: number) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, price, total: item.quantity * price }
        : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = {
      ...formData,
      items,
      subtotal,
      totalAmount: totalBill,
      amount: totalBill
    };
    onSubmit(transactionData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              <option value="Sales">Sales</option>
              <option value="Purchase">Purchase</option>
              <option value="Salary">Salary</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Utilities">Utilities</option>
              <option value="Fuel">Fuel</option>
              <option value="Equipment">Equipment</option>
              <option value="Seeds & Fertilizers">Seeds & Fertilizers</option>
              <option value="Others">Others</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Number</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Invoice/Receipt number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
            placeholder="Brief description of the transaction"
            required
          />
        </div>

        {/* Vendor and Payment Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor/Customer</label>
            <input
              type="text"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Name of vendor or customer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="upi">UPI</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
            </select>
          </div>
        </div>

        {/* Items Section */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Transaction Items</h3>
            <button
              type="button"
              onClick={() => setShowItemModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item from Inventory
            </button>
          </div>

          {items.length > 0 && (
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.quantity} {item.unit} × ₹{item.price} = ₹{item.total.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col space-y-1">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="1"
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItemPrice(item.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bill Summary */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Discount Amount</label>
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Tax Amount</label>
                <input
                  type="number"
                  value={formData.taxAmount}
                  onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">₹{totalBill.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={2}
            placeholder="Additional notes or comments"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Supporting Documents</label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setFormData({ ...formData, documents: [...formData.documents, ...e.target.files] });
              }
            }}
            className="mt-1 block w-full"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload invoices, receipts, or other supporting documents (PDF, Images, Documents)
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </form>

      {/* Item Selection Modal */}
      {showItemModal && (
        <ItemSelectionModal
          inventoryItems={inventoryItems}
          onAddItem={addItem}
          onClose={() => setShowItemModal(false)}
          transactionType={formData.type}
        />
      )}
    </>
  );
}

interface ItemSelectionModalProps {
  inventoryItems: InventoryItem[];
  onAddItem: (item: InventoryItem, quantity: number) => void;
  onClose: () => void;
  transactionType: string;
}

function ItemSelectionModal({ inventoryItems, onAddItem, onClose, transactionType }: ItemSelectionModalProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');

  const handleAdd = () => {
    if (selectedItem && quantity > 0) {
      const itemToAdd = {
        ...selectedItem,
        price: customPrice ? Number(customPrice) : selectedItem.price
      };
      onAddItem(itemToAdd, quantity);
    }
  };

  const getMaxQuantity = (item: InventoryItem) => {
    // For expense transactions, limit to available stock
    // For income transactions, allow any quantity (could be selling from external stock)
    return transactionType === 'expense' ? item.quantity : 999999;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Select Inventory Item</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Item Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Items
              </label>
              <div className="max-h-80 overflow-y-auto border rounded-lg">
                {inventoryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setCustomPrice('');
                      setQuantity(1);
                    }}
                    className={`p-3 cursor-pointer border-b hover:bg-gray-50 ${
                      selectedItem?.id === item.id ? 'bg-blue-50 border-blue-200' : ''
                    } ${transactionType === 'expense' && item.quantity === 0 ? 'opacity-50' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.category} • Available: {item.quantity} {item.unit}
                        </div>
                        {transactionType === 'expense' && item.quantity === 0 && (
                          <div className="text-xs text-red-500">Out of stock</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{item.price}</div>
                        <div className="text-sm text-gray-500">per {item.unit}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Item Details and Configuration */}
            <div>
              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Selected Item</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded">
                      <div className="font-medium">{selectedItem.name}</div>
                      <div className="text-sm text-gray-500">{selectedItem.category}</div>
                      <div className="text-sm text-gray-500">Available: {selectedItem.quantity} {selectedItem.unit}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        min="1"
                        max={getMaxQuantity(selectedItem)}
                      />
                      {transactionType === 'expense' && (
                        <p className="mt-1 text-xs text-gray-500">
                          Max: {selectedItem.quantity} {selectedItem.unit}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price per {selectedItem.unit}
                      </label>
                      <input
                        type="number"
                        value={customPrice || selectedItem.price}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Item Total:</span>
                      <span className="font-bold text-lg">
                        ₹{(quantity * (customPrice ? Number(customPrice) : selectedItem.price)).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {quantity} {selectedItem.unit} × ₹{customPrice || selectedItem.price}
                    </div>
                  </div>

                  {transactionType === 'expense' && quantity > selectedItem.quantity && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm text-red-600">
                        ⚠️ Insufficient stock! Available: {selectedItem.quantity} {selectedItem.unit}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select an item from the list</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selectedItem || quantity <= 0 || (transactionType === 'expense' && quantity > selectedItem.quantity)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}