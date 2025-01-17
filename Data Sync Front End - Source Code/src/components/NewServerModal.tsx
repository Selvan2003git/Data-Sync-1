import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { ServerConfig } from '../types/config';

interface NewServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (server: ServerConfig) => void;
}

export default function NewServerModal({ isOpen, onClose, onSave }: NewServerModalProps) {
  const [serverData, setServerData] = useState<ServerConfig>({
    id:'',
    name: '',
    serverUrl: '',
    endpoint: '',
    clientId: '',
    clientSecret: '',
    tokenEndpoint: '',
    refreshToken: '',
    accessToken : '',
    expiryTime : 0
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(serverData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Server</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Server Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={serverData.name}
                onChange={(e) => setServerData({ ...serverData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Server URL</label>
              <input
                type="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={serverData.serverUrl}
                onChange={(e) => setServerData({ ...serverData, serverUrl: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Endpoint</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={serverData.endpoint}
                onChange={(e) => setServerData({ ...serverData, endpoint: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client ID</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={serverData.clientId}
                onChange={(e) => setServerData({ ...serverData, clientId: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Secret</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={serverData.clientSecret}
                onChange={(e) => setServerData({ ...serverData, clientSecret: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Token Endpoint</label>
              <input
                type="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={serverData.tokenEndpoint}
                onChange={(e) => setServerData({ ...serverData, tokenEndpoint: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Refresh Token</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={serverData.refreshToken}
                onChange={(e) => setServerData({ ...serverData, refreshToken: e.target.value })}
                required
              />
            </div>
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
              Add Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}