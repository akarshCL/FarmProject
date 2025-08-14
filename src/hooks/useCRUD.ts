import { useState } from 'react';
import { usePermissions } from './usePermissions';

interface CRUDOptions {
  module: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useCRUD = <T extends { id: string }>({ module, onSuccess, onError }: CRUDOptions) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  const create = async (data: Omit<T, 'id'>) => {
    if (!hasPermission(module, 'create')) {
      throw new Error('Permission denied');
    }

    try {
      setLoading(true);
      // In a real application, this would be an API call
      const newItem = { ...data, id: Date.now().toString() } as T;
      setItems(prev => [...prev, newItem]);
      onSuccess?.();
      return newItem;
    } catch (err: any) {
      setError(err.message);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    if (!hasPermission(module, 'update')) {
      throw new Error('Permission denied');
    }

    try {
      setLoading(true);
      // In a real application, this would be an API call
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
      setItems(updatedItems);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!hasPermission(module, 'delete')) {
      throw new Error('Permission denied');
    }

    try {
      setLoading(true);
      // In a real application, this would be an API call
      setItems(prev => prev.filter(item => item.id !== id));
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getById = (id: string) => {
    return items.find(item => item.id === id);
  };

  return {
    items,
    loading,
    error,
    create,
    update,
    remove,
    getById,
    setItems
  };
};