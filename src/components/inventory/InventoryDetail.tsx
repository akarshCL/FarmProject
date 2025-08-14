import React, { useState } from 'react';
import { Package, AlertCircle, RefreshCw, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import { usePermissions } from '../../hooks/usePermissions';
import FormModal from '../shared/FormModal';
import DeleteConfirmation from '../shared/DeleteConfirmation';
import InventoryForm from '../forms/InventoryForm';
import InventoryMovementForm from '../forms/InventoryMovementForm';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  reorderLevel: number;
  description?: string;
  price: number;
}

interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'inward' | 'outward';
  quantity: number;
  reason: string;
  date: string;
  reference?: string;
}

export default function InventoryDetail() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isOutwardModalOpen, setIsOutwardModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'movements'>('items');
  
  const { hasPermission } = usePermissions();
  const { items, create, update, remove } = useCRUD<InventoryItem>({
    module: 'inventory',
    onSuccess: () => {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setIsDeleteModalOpen(false);
      setIsMovementModalOpen(false);
      setIsOutwardModalOpen(false);
      setSelectedItem(null);
    }
  });

  const [movements, setMovements] = useState<InventoryMovement[]>([
    {
      id: '1',
      itemId: '1',
      type: 'inward',
      quantity: 100,
      reason: 'Purchase from vendor',
      date: '2024-03-20',
      reference: 'PO-001'
    },
    {
      id: '2',
      itemId: '1',
      type: 'outward',
      quantity: 25,
      reason: 'Used in Field A',
      date: '2024-03-21',
      reference: 'WO-001'
    }
  ]);

  // Initialize with some sample data if empty
  React.useEffect(() => {
    if (items.length === 0) {
      const sampleItems: InventoryItem[] = [
        {
          id: '1',
          name: 'Wheat Seeds',
          category: 'Seeds',
          quantity: 100,
          unit: 'kg',
          lastUpdated: '2024-03-20',
          status: 'in-stock',
          reorderLevel: 20,
          price: 50
        },
        {
          id: '2',
          name: 'Fertilizer NPK',
          category: 'Fertilizers',
          quantity: 200,
          unit: 'kg',
          lastUpdated: '2024-03-20',
          status: 'in-stock',
          reorderLevel: 50,
          price: 25
        },
        {
          id: '3',
          name: 'Pesticide Spray',
          category: 'Pesticides',
          quantity: 50,
          unit: 'L',
          lastUpdated: '2024-03-20',
          status: 'in-stock',
          reorderLevel: 10,
          price: 150
        }
      ];
      // Set initial data without triggering the CRUD operations
      sampleItems.forEach(item => {
        create(item);
      });
    }
  }, []);

  const handleAdd = async (data: Omit<InventoryItem, 'id'>) => {
    await create({
      ...data,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: Number(data.quantity) === 0 ? 'out-of-stock' : 
              Number(data.quantity) <= Number(data.reorderLevel) ? 'low-stock' : 'in-stock'
    });
  };

  const handleEdit = async (data: Partial<InventoryItem>) => {
    if (selectedItem) {
      await update(selectedItem.id, {
        ...data,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: Number(data.quantity) === 0 ? 'out-of-stock' : 
                Number(data.quantity) <= Number(data.reorderLevel) ? 'low-stock' : 'in-stock'
      });
    }
  };

  const handleDelete = async () => {
    if (selectedItem) {
      await remove(selectedItem.id);
    }
  };

  const handleMovement = async (movementData: Omit<InventoryMovement, 'id'>) => {
    if (!selectedItem) return;

    const newMovement: InventoryMovement = {
      ...movementData,
      id: Date.now().toString(),
      itemId: selectedItem.id
    };

    setMovements([...movements, newMovement]);

    // Update inventory quantity
    const quantityChange = movementData.type === 'inward' 
      ? movementData.quantity 
      : -movementData.quantity;

    const newQuantity = selectedItem.quantity + quantityChange;
    
    await update(selectedItem.id, {
      quantity: Math.max(0, newQuantity),
      lastUpdated: new Date().toISOString().split('T')[0],
      status: newQuantity === 0 ? 'out-of-stock' : 
              newQuantity <= selectedItem.reorderLevel ? 'low-stock' : 'in-stock'
    });
  };

  const handleOutwardMovement = async (data: { itemId: string; quantity: number; reason: string }) => {
    const item = items.find(i => i.id === data.itemId);
    if (!item) return;

    if (data.quantity > item.quantity) {
      alert('Insufficient stock available');
      return;
    }

    const newMovement: InventoryMovement = {
      id: Date.now().toString(),
      itemId: data.itemId,
      type: 'outward',
      quantity: data.quantity,
      reason: data.reason,
      date: new Date().toISOString().split('T')[0]
    };

    setMovements([...movements, newMovement]);

    const newQuantity = item.quantity - data.quantity;
    await update(item.id, {
      quantity: Math.max(0, newQuantity),
      lastUpdated: new Date().toISOString().split('T')[0],
      status: newQuantity === 0 ? 'out-of-stock' : 
              newQuantity <= item.reorderLevel ? 'low-stock' : 'in-stock'
    });

    setIsOutwardModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementIcon = (type: string) => {
    return type === 'inward' ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    );
  };

  const getItemMovements = (itemId: string) => {
    return movements.filter(movement => movement.itemId === itemId);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-gray-600">Track and manage your farm inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold">
                {items.filter(item => item.status === 'low-stock').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Movements</p>
              <p className="text-2xl font-bold">{movements.length}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold">Today</p>
            </div>
            <RefreshCw className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('items')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'items'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Inventory Items
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'movements'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Stock Movements
            </button>
          </nav>
        </div>

        {activeTab === 'items' && (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Inventory Items</h2>
                {hasPermission('inventory', 'create') && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.quantity} {item.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{item.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsMovementModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Move Stock
                        </button>
                        {hasPermission('inventory', 'update') && (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Edit
                          </button>
                        )}
                        {hasPermission('inventory', 'delete') && (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'movements' && (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Stock Movements</h2>
                <button
                  onClick={() => setIsOutwardModalOpen(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Outward Movement
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movements.map((movement) => {
                    const item = items.find(i => i.id === movement.itemId);
                    return (
                      <tr key={movement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item?.name || 'Unknown Item'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getMovementIcon(movement.type)}
                            <span className={`ml-2 text-sm font-medium ${
                              movement.type === 'inward' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity} {item?.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {movement.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {movement.reference || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Item Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Inventory Item"
      >
        <InventoryForm onSubmit={handleAdd} />
      </FormModal>

      {/* Edit Item Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        title="Edit Inventory Item"
      >
        <InventoryForm onSubmit={handleEdit} initialData={selectedItem} />
      </FormModal>

      {/* Stock Movement Modal */}
      <FormModal
        isOpen={isMovementModalOpen}
        onClose={() => {
          setIsMovementModalOpen(false);
          setSelectedItem(null);
        }}
        title={`Stock Movement - ${selectedItem?.name}`}
      >
        <InventoryMovementForm 
          onSubmit={handleMovement} 
          currentStock={selectedItem?.quantity || 0}
          unit={selectedItem?.unit || ''}
        />
      </FormModal>

      {/* Outward Movement Modal */}
      <FormModal
        isOpen={isOutwardModalOpen}
        onClose={() => setIsOutwardModalOpen(false)}
        title="Outward Movement"
      >
        <OutwardMovementForm 
          items={items}
          onSubmit={handleOutwardMovement}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        itemName={selectedItem?.name || 'this item'}
      />
    </div>
  );
}

// Outward Movement Form Component
interface OutwardMovementFormProps {
  items: InventoryItem[];
  onSubmit: (data: { itemId: string; quantity: number; reason: string }) => void;
}

function OutwardMovementForm({ items, onSubmit }: OutwardMovementFormProps) {
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: '',
    reason: ''
  });

  const selectedItem = items.find(item => item.id === formData.itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || !formData.quantity || !formData.reason) return;
    
    onSubmit({
      itemId: formData.itemId,
      quantity: Number(formData.quantity),
      reason: formData.reason
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Inventory Item</label>
        <select
          value={formData.itemId}
          onChange={(e) => setFormData({ ...formData, itemId: e.target.value, quantity: '' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Select Item</option>
          {items.filter(item => item.quantity > 0).map(item => (
            <option key={item.id} value={item.id}>
              {item.name} - Available: {item.quantity} {item.unit}
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm">
            <div><strong>Item:</strong> {selectedItem.name}</div>
            <div><strong>Available Stock:</strong> {selectedItem.quantity} {selectedItem.unit}</div>
            <div><strong>Category:</strong> {selectedItem.category}</div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          min="1"
          max={selectedItem?.quantity || 0}
          required
        />
        {selectedItem && (
          <p className="mt-1 text-sm text-gray-500">
            Maximum available: {selectedItem.quantity} {selectedItem.unit}
          </p>
        )}
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
          <option value="Used in field operations">Used in field operations</option>
          <option value="Sold to customer">Sold to customer</option>
          <option value="Transfer to other location">Transfer to other location</option>
          <option value="Damaged/Expired">Damaged/Expired</option>
          <option value="Maintenance consumption">Maintenance consumption</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={!formData.itemId || !formData.quantity || !formData.reason}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          Record Outward Movement
        </button>
      </div>
    </form>
  );
}