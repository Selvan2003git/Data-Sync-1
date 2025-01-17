import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';

interface Log {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  selectedQueries: string[];
  selectedServers: string[];
  logs: Log[];
  eventSource: EventSource | null;
  
  // Actions
  setIsSyncing: (status: boolean) => void;
  setLastSyncTime: (time: Date | null) => void;
  setSelectedQueries: (queries: string[]) => void;
  setSelectedServers: (servers: string[]) => void;
  addLog: (log: Omit<Log, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  // SSE Connection
  connectSSE: () => void;
  disconnectSSE: () => void;
  
  // Sync Operations
  startSync: (queryIds: string[], serverIds: string[]) => Promise<void>;
  stopSync: () => Promise<void>;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      isSyncing: false,
      lastSyncTime: null,
      selectedQueries: [],
      selectedServers: [],
      logs: [],
      eventSource: null,

      setIsSyncing: (status) => set({ isSyncing: status }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      setSelectedQueries: (queries) => set({ selectedQueries: queries }),
      setSelectedServers: (servers) => set({ selectedServers: servers }),
      
      addLog: (log) => set((state) => ({
        logs: [...state.logs, {
          ...log,
          id: Date.now().toString(),
          timestamp: new Date()
        }]
      })),
      
      clearLogs: () => set({ logs: [] }),

      connectSSE: () => {
        const { eventSource } = get();
        if (eventSource) return;

        const sse = new EventSource('/api/logs', {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        sse.onmessage = (event) => {
          const logData = JSON.parse(event.data);
          get().addLog({
            message: logData.message,
            type: logData.type
          });
        };

        sse.onerror = () => {
          get().disconnectSSE();
        };

        set({ eventSource: sse });
      },

      disconnectSSE: () => {
        const { eventSource } = get();
        if (eventSource) {
          eventSource.close();
          set({ eventSource: null });
        }
      },

      startSync: async (queryIds, serverIds) => {
        try {
          const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ queryIds, serverIds })
          });

          if (!response.ok) throw new Error('Failed to start sync');

          set({ isSyncing: true });
          get().connectSSE();
          get().addLog({
            message: `Started sync for ${queryIds.length} queries on ${serverIds.length} servers`,
            type: 'info'
          });
        } catch (error) {
          get().addLog({
            message: `Sync failed to start: ${error.message}`,
            type: 'error'
          });
        }
      },

      stopSync: async () => {
        try {
          const response = await fetch('/api/sync/stop', {
            method: 'POST'
          });

          if (!response.ok) throw new Error('Failed to stop sync');

          set({ 
            isSyncing: false,
            lastSyncTime: new Date()
          });
          get().disconnectSSE();
          get().addLog({
            message: 'Sync stopped successfully',
            type: 'success'
          });
        } catch (error) {
          get().addLog({
            message: `Failed to stop sync: ${error.message}`,
            type: 'error'
          });
        }
      }
    }),
    {
      name: 'sync-storage',
      partialize: (state) => ({
        lastSyncTime: state.lastSyncTime,
        selectedQueries: state.selectedQueries,
        selectedServers: state.selectedServers,
        logs: state.logs
      })
    }
  )
);