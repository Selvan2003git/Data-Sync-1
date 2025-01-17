import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServerConfig } from '../types/config';
import { useSyncStore } from './syncStore';

interface ServerStore {
  servers: ServerConfig[];
  addServer: (server: ServerConfig) => void;
  removeServer: (serverId: string) => void;
  updateServer: (serverId: string, updatedServer: ServerConfig) => void;
  updateServerToken: (serverId: string, accessToken: string, expiryTime: number) => void;
  clearServers: () => void;
}

export const useServerStore = create<ServerStore>()(
  persist(
    (set) => ({
      servers: [],
      addServer: (server) => {
        set((state) => ({ servers: [...state.servers, server] }));
        useSyncStore.getState().updateSelectedItems();
      },
      removeServer: (serverId) => {
        set((state) => ({
          servers: state.servers.filter(s => s.id !== serverId)
        }));
        useSyncStore.getState().updateSelectedItems();
      },
      updateServer: (serverId, updatedServer) => {
        set((state) => ({
          servers: state.servers.map(s => 
            s.id === serverId ? { ...updatedServer, id: serverId } : s
          )
        }));
        useSyncStore.getState().updateSelectedItems();
      },
      updateServerToken: (serverId, accessToken, expiryTime) => {
      
        set((state) => ({
          servers: state.servers.map(s => 
            s.id === serverId 
              ? { ...s, accessToken, expiryTime }
              : s
          )
        }));
      },
      clearServers: () => {
        set({ servers: [] });
        useSyncStore.getState().updateSelectedItems();
      }
    }),
    {
      name: 'server-storage'
    }
  )
);