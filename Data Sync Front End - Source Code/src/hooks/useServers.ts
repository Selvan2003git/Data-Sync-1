import { v4 as uuidv4 } from 'uuid';
import type { ServerConfig } from '../types/config';
import { useServerStore } from '../stores/serverStore';

export function useServers() {
  const { servers, addServer: addServerToStore, removeServer: removeServerFromStore, updateServer: updateServerInStore } = useServerStore();

  const addServer = (server: Omit<ServerConfig, 'id'>) => {
    const newServer = {
      ...server,
      id: uuidv4()
    };
    addServerToStore(newServer);
  };

  const removeServer = (serverId: string) => {
    removeServerFromStore(serverId);
  };

  const updateServer = (serverId: string, updatedServer: ServerConfig) => {
    updateServerInStore(serverId, updatedServer);
  };

  return {
    servers,
    addServer,
    removeServer,
    updateServer
  };
}