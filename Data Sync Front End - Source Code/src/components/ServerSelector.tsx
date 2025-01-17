import React from 'react';
import { useServers } from '../hooks/useServers';
import { ServerConfig } from '../types/config';

interface ServerSelectorProps {
  selectedServers: ServerConfig[];
  onServerSelect: (servers: ServerConfig[]) => void;
}

export default function ServerSelector({ selectedServers, onServerSelect }: ServerSelectorProps) {
  const { servers } = useServers();

  const handleSelectAll = () => {
    onServerSelect(servers);
  };

  const handleServerToggle = (server: ServerConfig) => {
    const isSelected = selectedServers.some(s => s.id === server.id);
    const updatedSelection = isSelected
      ? selectedServers.filter(s => s.id !== server.id)
      : [...selectedServers, server];
    onServerSelect(updatedSelection);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        {/* <button
          type="button"
          onClick={handleSelectAll}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Select All
        </button> */}
      </div>
      <div className="space-y-2">
        {servers.map((server) => (
          <label 
            key={`server-${server.name}`}
            className="flex items-center space-x-2"
          >
            {/* <input
              type="checkbox"
              checked={selectedServers.some(s => s.id === server.id)}
              onChange={() => handleServerToggle(server)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            /> */}
            <input
              type="checkbox"
              checked={true}
              disabled
              className="rounded border-gray-300 text-gray-400 cursor-not-allowed"
            />
            <span className="text-sm text-gray-700">{server.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}