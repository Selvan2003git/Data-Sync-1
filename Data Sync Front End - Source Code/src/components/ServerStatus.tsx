import React, { useState } from 'react';
import { Server, CheckCircle, XCircle } from 'lucide-react';
import type { ServerConfig } from '../types/config';
import ServerDetails from './ServerDetails';
import EditServerModal from './EditServerModal';
import { useServers } from '../hooks/useServers';

interface ServerStatusProps {
  server: ServerConfig;
  isOnline: boolean;
}

export default function ServerStatus({ server, isOnline }: ServerStatusProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { removeServer, updateServer } = useServers();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      removeServer(server.id); // Use server.id instead of server.name
      setShowDetails(false);
    }
  };

  const handleEdit = (updatedServer: ServerConfig) => {
    updateServer(server.id, { ...updatedServer, id: server.id }); // Preserve the original ID
    setShowEdit(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <h3 className="text-lg font-medium">{server.name}</h3>
              <p className="text-sm text-gray-500">{server.serverUrl}</p>
            </div>
          </div>
          {/* {isOnline ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )} */}
        </div>
      </div>

      {showDetails && (
        <ServerDetails
          server={server}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            setShowDetails(false);
            setShowEdit(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showEdit && (
        <EditServerModal
          server={server}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSave={handleEdit}
        />
      )}
    </>
  );
}