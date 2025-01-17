import React from 'react';
import { Clock, Server } from 'lucide-react';
import { useExecutions } from '../../hooks/useExecutions';
import { formatDistanceToNow } from 'date-fns';

export default function ActiveQueries() {
  const { activeExecutions } = useExecutions();

  if (activeExecutions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No active queries
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeExecutions.map((execution) => (
        <div key={execution.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Query {execution.viewId}</h3>
              <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                {execution.queryString}
              </pre>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatDistanceToNow(execution.startTime, { addSuffix: true })}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-gray-400" />
            <div className="text-sm text-gray-600">
              Running on: {execution.servers.join(', ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}