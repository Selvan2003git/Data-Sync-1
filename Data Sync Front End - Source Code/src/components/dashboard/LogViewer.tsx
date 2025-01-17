import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Log {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface LogViewerProps {
  logs: Log[];
  onClear: () => void;
}

export default function LogViewer({ logs, onClear }: LogViewerProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sync Logs</h2>
          <button
            onClick={onClear}
            className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear Logs
          </button>
        </div>

        <div className="h-96 overflow-y-auto bg-gray-900 rounded-lg">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No logs available
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 text-sm font-mono"
                >
                  <div className="flex items-center text-gray-500 min-w-[150px]">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <span className={`flex-1 ${
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'success' ? 'text-green-400' :
                    'text-gray-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}