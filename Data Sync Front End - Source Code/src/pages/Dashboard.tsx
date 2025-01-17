import React from 'react';
import ConfigurationPrompt from '../components/dashboard/ConfigurationPrompt';
import SyncControl from '../components/dashboard/SyncControl';
import LogViewer from '../components/dashboard/LogViewer';
import LastSyncTime from '../components/dashboard/LastSyncTime';
import { useServerStore } from '../stores/serverStore';
import { useQueryStore } from '../stores/queryStore';
import { useSyncStore } from '../stores/syncStore';

export default function Dashboard() {
  const { servers } = useServerStore();
  const { queries } = useQueryStore();
  const { 
    isSyncing,
    lastSyncTime,
    logs,
    clearLogs,
    startSync,
    stopSync
  } = useSyncStore();

  const hasConfiguration = servers.length > 0 || queries.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {!hasConfiguration ? (
        <ConfigurationPrompt />
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <LastSyncTime lastSyncTime={lastSyncTime} />
          </div>
          <SyncControl
            onSync={startSync}
            onStop={stopSync}
            isSyncing={isSyncing}
          />
          <LogViewer logs={logs} onClear={clearLogs} />
        </div>
      )}
    </div>
  );
}