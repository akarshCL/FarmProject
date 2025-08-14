import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import { usePermissions } from '../../hooks/usePermissions';
import FormModal from '../shared/FormModal';
import DeleteConfirmation from '../shared/DeleteConfirmation';
import TransactionForm from '../forms/TransactionForm';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  items?: any[];
  totalAmount?: number;
  reference?: string;
}

export default function FinanceDetail() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const { hasPermission } = usePermissions();
  const { items: transactions, create, update, remove } = useCRUD<Transaction>({
    module: 'finance',
    onSuccess: () => {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    }
  });

  // Initialize with some sample data if empty
  React.useEffect(() => {
    if (transactions.length === 0) {
      const sampleTransactions: Transaction[] = [
        {
          id: '1',
          date: '2024-03-20',
          description: 'Crop Sale - Wheat',
          category: 'Sales',
          type: 'income',
          amount: 50000,
          status: 'completed'
        },
        {
          id: '2',
          date: '2024-03-19',
          description: 'Fertilizer Purchase',
          category: 'Supplies',
          type: 'expense',
          amount: 15000,
          status: 'completed'
        },
        {
          id: '3',
          date: '2024-03-18',
          description: 'Equipment Maintenance',
          category: 'Maintenance',
          type: 'expense',
          amount: 8000,
          status: 'pending'
        }
      ];
      // Set initial data without triggering the CRUD operations
      sampleTransactions.forEach(transaction => {
        create(transaction);
      });
    }
  }, []);

  const handleAdd = async (data: Omit<Transaction, 'id'>) => {
    const transactionData = {
      ...data,
      amount: data.totalAmount || data.amount || 0,
      status: 'completed' as const
    };
    await create(transactionData);
  };

  const handleEdit = async (data: Partial<Transaction>) => {
    if (selectedTransaction) {
      await update(selectedTransaction.id, {
        ...data,
        amount: data.totalAmount || data.amount || selectedTransaction.amount
      });
    }
  };

  const handleDelete = async () => {
    if (selectedTransaction) {
      await remove(selectedTransaction.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
        <p className="text-gray-600">Track and manage your farm's finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold">₹{netProfit.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold">{profitMargin}%</p>
            </div>
            <PieChart className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            {hasPermission('finance', 'create') && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Transaction
              </button>
            )}
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
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getAmountColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    {hasPermission('finance', 'update') && (
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsEditModalOpen(true);
                        }}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Edit
                      </button>
                    )}
                    {hasPermission('finance', 'delete') && (
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
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
      </div>

      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Transaction"
      >
        <TransactionForm onSubmit={handleAdd} />
      </FormModal>

      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        title="Edit Transaction"
      >
        <TransactionForm onSubmit={handleEdit} initialData={selectedTransaction} />
      </FormModal>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleDelete}
        itemName={selectedTransaction?.description || 'this transaction'}
      />
    </div>
  );
}