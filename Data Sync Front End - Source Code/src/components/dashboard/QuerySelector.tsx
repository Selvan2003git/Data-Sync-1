import React from 'react';
import { useQueries } from '../../hooks/useQueries';
import { QueryConfig } from '../../types/config';

interface QuerySelectorProps {
  selectedQueries: QueryConfig[];
  onQuerySelect: (queries: QueryConfig[]) => void;
}

export default function QuerySelector({ selectedQueries, onQuerySelect }: QuerySelectorProps) {
  const { queries } = useQueries();

  const handleSelectAll = () => {
    onQuerySelect(queries);
  };

  const handleQueryToggle = (query: QueryConfig) => {
    const isSelected = selectedQueries.some(q => q.id === query.id);
    const updatedSelection = isSelected
      ? selectedQueries.filter(q => q.id !== query.id)
      : [...selectedQueries, query];
     
    onQuerySelect(updatedSelection);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handleSelectAll}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Select All
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {queries.map((query, index) => (
          <label 
            key={`query-${query.viewId}-${index}`}
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              checked={selectedQueries.some(q => q.viewId === query.viewId)}
              onChange={() => handleQueryToggle(query)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              Query {query.viewId}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}