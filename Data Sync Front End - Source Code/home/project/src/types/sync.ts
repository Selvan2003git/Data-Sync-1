export interface Log {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  selectedQueries: string[];
  selectedServers: string[];
  logs: Log[];
}