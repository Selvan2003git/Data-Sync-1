import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { QueryConfig } from '../types/config';
import QueryCard from '../components/QueryCard';
import NewQueryModal from '../components/NewQueryModal';
import { useQueries } from '../hooks/useQueries';

export default function Queries() {
  const { queries, addQuery, executeQuery } = useQueries();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExecute = async (query: QueryConfig, servers: string[]) => {
    try {
      await executeQuery(query, servers);
      // Handle success
    } catch (error) {
      console.error('Error executing query:', error);
      // Handle error
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Queries</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Query
        </button>
      </div>

      <div className="grid gap-4">
        {queries.map((query, index) => (
          <QueryCard
            key={index}
            query={query}
            onExecute={(servers) => handleExecute(query, servers)}
          />
        ))}
      </div>

      <NewQueryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addQuery}
      />
    </div>
  );
}