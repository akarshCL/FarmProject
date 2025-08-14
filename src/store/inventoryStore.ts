import { create } from 'zustand';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  reorderLevel: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'inward' | 'outward';
  quantity: number;
  reason: string;
  date: string;
  reference?: string;
  transactionId?: string;
}

interface InventoryState {
  items: InventoryItem[];
  movements: InventoryMovement[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  addMovement: (movement: Omit<InventoryMovement, 'id'>) => void;
  updateInventoryFromTransaction: (items: any[], transactionType: 'income' | 'expense', transactionId: string) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [
    {
      id: '1',
      name: 'Wheat Seeds',
      category: 'Seeds',
      quantity: 100,
      unit: 'kg',
      price: 50,
      reorderLevel: 20,
      status: 'in-stock',
      lastUpdated: '2024-03-20'
    },
    {
      id: '2',
      name: 'Fertilizer NPK',
      category: 'Fertilizers',
      quantity: 200,
      unit: 'kg',
      price: 25,
      reorderLevel: 50,
      status: 'in-stock',
      lastUpdated: '2024-03-20'
    },
    {
      id: '3',
      name: 'Pesticide Spray',
      category: 'Pesticides',
      quantity: 50,
      unit: 'L',
      price: 150,
      reorderLevel: 10,
      status: 'in-stock',
      lastUpdated: '2024-03-20'
    },
    {
      id: '4',
      name: 'Hand Tools',
      category: 'Tools',
      quantity: 20,
      unit: 'units',
      price: 500,
      reorderLevel: 5,
      status: 'in-stock',
      lastUpdated: '2024-03-20'
    },
    {
      id: '5',
      name: 'Diesel Fuel',
      category: 'Fuel',
      quantity: 500,
      unit: 'L',
      price: 90,
      reorderLevel: 100,
      status: 'in-stock',
      lastUpdated: '2024-03-20'
    },
    {
      id: '6',
      name: 'Irrigation Pipes',
      category: 'Equipment',
      quantity: 100,
      unit: 'meters',
      price: 120,
      reorderLevel: 20,
      status: 'in-stock',
      lastUpdated: '2024-03-20'
    }
  ],
  movements: [
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
  ],

  addItem: (item) => set((state) => ({
    items: [...state.items, { ...item, id: Date.now().toString() }]
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            ...updates,
            status: updates.quantity !== undefined 
              ? updates.quantity === 0 ? 'out-of-stock' 
                : updates.quantity <= item.reorderLevel ? 'low-stock' 
                : 'in-stock'
              : item.status
          }
        : item
    )
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  addMovement: (movement) => set((state) => ({
    movements: [...state.movements, { ...movement, id: Date.now().toString() }]
  })),

  updateInventoryFromTransaction: (transactionItems, transactionType, transactionId) => {
    const { items, movements, updateItem, addMovement } = get();
    
    transactionItems.forEach(transactionItem => {
      const inventoryItem = items.find(item => item.id === transactionItem.inventoryItemId);
      if (!inventoryItem) return;

      let movementType: 'inward' | 'outward';
      let reason: string;
      let quantityChange: number;

      if (transactionType === 'expense') {
        // For expenses (purchases), items go into inventory (inward)
        // But if it's usage/consumption, items go out (outward)
        // We'll assume expenses are consumption/usage by default
        movementType = 'outward';
        reason = 'Used in operations';
        quantityChange = -transactionItem.quantity;
      } else {
        // For income (sales), items go out of inventory (outward)
        movementType = 'outward';
        reason = 'Sold to customer';
        quantityChange = -transactionItem.quantity;
      }

      // Update inventory quantity
      const newQuantity = Math.max(0, inventoryItem.quantity + quantityChange);
      updateItem(inventoryItem.id, {
        quantity: newQuantity,
        lastUpdated: new Date().toISOString().split('T')[0]
      });

      // Add movement record
      addMovement({
        itemId: inventoryItem.id,
        type: movementType,
        quantity: Math.abs(quantityChange),
        reason,
        date: new Date().toISOString().split('T')[0],
        reference: `TXN-${transactionId}`,
        transactionId
      });
    });
  }
}));