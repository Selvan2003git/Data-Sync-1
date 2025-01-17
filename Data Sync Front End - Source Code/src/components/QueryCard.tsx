import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import type { QueryConfig } from '../types/config';
import QueryDetails from './QueryDetails';
import NewQueryModal from './NewQueryModal';
import { useQueries } from '../hooks/useQueries';

interface QueryCardProps {
  query: QueryConfig;
}

export default function QueryCard({ query }: QueryCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { removeQuery, updateQuery } = useQueries();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      removeQuery(query.id); // Use query.id instead of viewId
      setShowDetails(false);
    }
  };

  const handleEdit = (updatedQuery: QueryConfig) => {
    updateQuery(query.id, { ...updatedQuery, id: query.id }); // Preserve the original ID
    setShowEdit(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Query {query.viewId}</h3>
            <pre className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
              {query.queryString}
            </pre>
          </div>
          
        </div>
      </div>

      {showDetails && (
        <QueryDetails
          query={query}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            setShowDetails(false);
            setShowEdit(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showEdit && (
        <NewQueryModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSave={handleEdit}
          initialData={query}
        />
      )}
    </>
  );
}