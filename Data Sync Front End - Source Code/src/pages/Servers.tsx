import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ServerStatus from '../components/ServerStatus';
import NewServerModal from '../components/NewServerModal';
import { useServers } from '../hooks/useServers';

export default function Servers() {
  const { servers, addServer } = useServers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Servers</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Server
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server, index) => (
          <ServerStatus 
            key={`${server.name}-${index}`} // Using combination of name and index for unique key
            server={server} 
            isOnline={Math.random() > 0.2}
          />
        ))}
      </div>

      <NewServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addServer}
      />
    </div>
  );
}