import React from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import type { ServerConfig } from '../types/config';

interface ServerDetailsProps {
  server: ServerConfig;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServerDetails({ server, onClose, onEdit, onDelete }: ServerDetailsProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Server Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Server Name</label>
            <p className="mt-1 text-sm text-gray-900">{server.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Server URL</label>
            <p className="mt-1 text-sm text-gray-900">{server.serverUrl}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Endpoint</label>
            <p className="mt-1 text-sm text-gray-900">{server.endpoint}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client ID</label>
            <p className="mt-1 text-sm text-gray-900">{server.clientId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Token Endpoint</label>
            <p className="mt-1 text-sm text-gray-900">{server.tokenEndpoint}</p>
          </div>

        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}