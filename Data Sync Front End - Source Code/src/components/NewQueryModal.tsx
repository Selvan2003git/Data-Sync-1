import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { QueryConfig } from '../types/config';

interface NewQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (query: Omit<QueryConfig, 'id'>) => any;
  initialData?: QueryConfig;
}

const defaultQueryData: Omit<QueryConfig, 'id'> = {
  queryString: '',
  viewId: '',
  mergeType: 'consider_null',
  numericDefault: 0,
  stringDefault: '-'
};

export default function NewQueryModal({ isOpen, onClose, onSave, initialData }: NewQueryModalProps) {
  const [queryData, setQueryData] = useState<Omit<QueryConfig, 'id'>>(defaultQueryData);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setQueryData(rest);
    } else {
      setQueryData(defaultQueryData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(queryData);
    onClose();
    
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{initialData ? 'Edit Query' : 'New Query'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Query String</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              value={queryData.queryString}
              onChange={(e) => setQueryData(prev => ({ ...prev, queryString: e.target.value }))}
              placeholder="SELECT * FROM table"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">View ID</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={queryData.viewId}
              onChange={(e) => setQueryData(prev => ({ ...prev, viewId: e.target.value}))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Merge Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={queryData.mergeType}
              onChange={(e) => setQueryData(prev => ({ ...prev, mergeType: e.target.value as QueryConfig['mergeType'] }))}
              required
            >
              <option value="ignore">Ignore</option>
              <option value="consider_null">Consider Null</option>
              <option value="consider_default">Consider Default</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Numeric Default</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={queryData.numericDefault}
              onChange={(e) => setQueryData(prev => ({ ...prev, numericDefault: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">String Default</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={queryData.stringDefault}
              onChange={(e) => setQueryData(prev => ({ ...prev, stringDefault: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
            >
              {initialData ? 'Save Changes' : 'Add Query'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}