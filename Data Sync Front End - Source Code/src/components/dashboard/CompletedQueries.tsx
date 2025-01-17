import React from 'react';
import { Clock, Server, CheckCircle, XCircle } from 'lucide-react';
import { useExecutions } from '../../hooks/useExecutions';
import { formatDistanceToNow, format } from 'date-fns';

export default function CompletedQueries() {
  const { completedExecutions } = useExecutions();

  if (completedExecutions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No completed queries yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completedExecutions.map((execution) => (
        <div 
          key={execution.id} 
          className={`bg-white rounded-lg shadow p-4 border-l-4 ${
            execution.status === 'completed' ? 'border-green-500' : 'border-red-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                {execution.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <h3 className="font-medium">Query {execution.viewId}</h3>
              </div>
              <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                {execution.queryString}
              </pre>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 mr-1" />
                Started: {format(execution.startTime, 'HH:mm:ss')}
              </div>
              <div className="text-right">
                ({formatDistanceToNow(execution.startTime, { addSuffix: true })})
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-gray-400" />
            <div className="text-sm text-gray-600">
              Executed on: {execution.servers.join(', ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}