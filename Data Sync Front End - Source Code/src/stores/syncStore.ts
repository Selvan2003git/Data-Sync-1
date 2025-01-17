import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QueryConfig, ServerConfig } from '../types/config';
import { SelectedItems } from '../types/selected';
import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';
import { useServerStore } from './serverStore';
import { useQueryStore } from './queryStore';

interface Log {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  selectedItems: SelectedItems;
  logs: Log[];
  eventSource: EventSource | null;
  
  // Actions
  setIsSyncing: (status: boolean) => void;
  setLastSyncTime: (time: Date | null) => void;
  setSelectedQueries: (queries: QueryConfig[]) => void;
  setSelectedServers: (servers: ServerConfig[]) => void;
  updateSelectedItems: () => void;
  addLog: (log: Omit<Log, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  

  connectSSE: (sessionId : any) => void;
  disconnectSSE: () => void;
  
  // Sync Operations
  startSync: ([],[],{}) => any;
  stopSync: () => any;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      isSyncing: false,
      lastSyncTime: null,
      selectedItems: {
        queries: [],
        servers: []
      },
      logs: [],
      eventSource: null,

      setIsSyncing: (status) => set({ isSyncing: status }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      
      setSelectedQueries: (queries) => set((state) => ({
        selectedItems: {
          ...state.selectedItems,
          queries
        }
      })),
      
      setSelectedServers: (servers) => set((state) => ({
        selectedItems: {
          ...state.selectedItems,
          servers
        }
      })),

      updateSelectedItems: () => {
        const servers = useServerStore.getState().servers;
        const queries = useQueryStore.getState().queries;
        
        
        set((state) => ({
          selectedItems: {
            queries: queries.filter(q => 
              state.selectedItems.queries.some(sq => sq.id === q.id)
            ),
            servers: servers // Always keep all servers selected
          }
        }));
      },
      
      addLog: (log) => set((state) => ({
        logs: [...state.logs, {
          ...log,
          id: Date.now().toString(),
          timestamp: new Date()
        }]
      })),
      
      clearLogs: () => set({ logs: [] }),

      connectSSE: (sessionId: any) => {
        const { eventSource } = get();
        if (eventSource) return;

        const sse = new EventSource(`http://localhost:8086/api/logs/stream/${sessionId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        sse.onmessage = (event : any) => {
          
          get().addLog({
            message: event.data,
            type: 'info'
          });

          if(event.data.includes('Sync Process Completed')) {
            //       // When the sync completes, set the sync completion status
            //set({ isSyncing: false });
            set({lastSyncTime : new Date()})
            //       setIsSyncing(false);
            //       setLastSyncTime(new Date());
            //       //setLastSyncTime(new Date());
            //     }
          }
        };

        sse.onerror = () => {
          get().disconnectSSE();
          get().addLog({
            message: "Disconnected from SSE",
            type: 'error'
          });
          set({ isSyncing: false });
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

      startSync: async (queryIds, serverIds,target) => {
       
        try {
          const response = await fetch('http://localhost:8086/api/executeQueries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ queries : queryIds, servers : serverIds,target })
          });

          if (!response.ok) throw new Error('Failed to start sync');
          else if(response.ok){
          const data = await response.json();
          const sessionId = data.sessionId;
         
          set({ isSyncing: true });
          await get().connectSSE(sessionId);
          get().addLog({
            message: `Started sync for queries on servers`,
            type: 'info'
          });}
        } catch (error) {
          get().addLog({
            message: `Sync failed to start:`,
            type: 'error'
          });
        }
      
      },
      stopSync: async () => {
        set({ 
          isSyncing: false,
          lastSyncTime: new Date()
        });
        await get().disconnectSSE();
        get().addLog({
          message: 'Sync stopped successfully',
          type: 'success'
        });
        //clearInterval(intervalId);
      } 
    }),
    {
      name: 'sync-storage',
      partialize: (state) => ({
        lastSyncTime: state.lastSyncTime,
        selectedItems: state.selectedItems,
        logs: state.logs,
        isSyncing: state.isSyncing
      })
    }
  )
);
