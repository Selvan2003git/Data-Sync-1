import React, { useRef, useState } from 'react';
import { Play, Server, Square } from 'lucide-react';
import QuerySelector from './QuerySelector';
import ServerSelector from '../ServerSelector';
import { useSyncStore } from '../../stores/syncStore';
import { useServerStore } from '../../stores/serverStore';
import { useQueryStore } from '../../stores/queryStore';
import { useTargetStore } from '../../stores/targetStore';
import { getAccessToken } from '../../utils/TokenManager';
import  {ServerConfig}  from '../../types/config';

interface SyncControlProps {
  onSync: (queryIds: any, serverIds: any, target : any) => any;
  onStop: () => any;
  isSyncing: boolean;
}

interface Server{
  id: string;
  name: string;
  serverUrl: string;
  endpoint: string;
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  refreshToken: string;
  accessToken : string,
  expiryTime : number
  
}

export default function SyncControl({ onSync, onStop, isSyncing }: SyncControlProps) {

  const { servers } = useServerStore();
  const {queries} = useQueryStore();
  const target = useTargetStore();
  const serverStore = useServerStore.getState();
  

  const { 
    selectedItems,
    setSelectedQueries,
    setSelectedServers,
  } = useSyncStore();


  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleSync = async () => {

    let selectedQueries = []
    let selectedServers = []
    
    let servers = []
     for(let i = 0;i<selectedItems.servers.length;++i){
         let server = selectedItems.servers[i];
        //  console.log(server);
         const serverToken = {refresh_token : server.refreshToken, access_token : server.accessToken, expiryTime : server.expiryTime}
         const tokenDetails = await getAccessToken(server.name,server.clientId,server.clientSecret,server.tokenEndpoint, serverToken)
         server.accessToken = tokenDetails["access_token"]
         server.expiryTime = tokenDetails["expiryTime"]
         servers.push(server);
    
        serverStore.updateServerToken(server.id, tokenDetails["access_token"], tokenDetails["expiryTime"]);
        
        // For target:
        // const targetStore = useTargetStore.getState();
        // targetStore.updateTargetToken(tokenDetails["access_token"], tokenDetails["expiryTime"]);
        
         
     }


     for(let i = 0;i<servers.length;++i){
      const obj = servers[i]
      const keyToRemove = 'id';

    const newObj = Object.fromEntries(
     Object.entries(obj).filter(([key]) => key !== keyToRemove)
     );
     selectedServers.push(newObj);
    }
  

     for(let i = 0;i<selectedItems.queries.length;++i){
      const obj = selectedItems.queries[i]
      const keyToRemove = 'id';

    const newObj = Object.fromEntries(
     Object.entries(obj).filter(([key]) => key !== keyToRemove)
     );
     selectedQueries.push(newObj);
    }

    const keysToRemove = ['frequency', 'format'];

    const targetConfig = Object.fromEntries(
    Object.entries(target.config).filter(([key]) => !keysToRemove.includes(key))
     );

     await onSync(selectedQueries, selectedServers, targetConfig);
     isSyncing = false 
  };

  const startSync = () => {
    // Ensure only one interval is running
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    // Run handleSync immediately and then every 5 seconds
    let timeInterval = target.config.frequency;
    let format = target.config.format;
   
    if(format == 'hours'){
      timeInterval = timeInterval * 60 * 60 * 1000;

    }
    else{
      timeInterval = timeInterval * 60 * 60 * 1000 * 24;
    }
  
    intervalIdRef.current =  setInterval(handleSync, timeInterval);
    handleSync();
     // Adjust interval as needed
  };

  const stopSync = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      // console.log("Syncing stopped.");
    }

    onStop();

  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sync Configuration</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Queries</h3>
            <QuerySelector
              selectedQueries={selectedItems.queries}
              onQuerySelect={setSelectedQueries}
            />
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Servers</h3>
            <ServerSelector
              selectedServers={selectedItems.servers}
              onServerSelect={setSelectedServers}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
        <button
          onClick={startSync}
          disabled={isSyncing || !selectedItems.queries.length || !selectedItems.servers.length}
          className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Play className="h-5 w-5 mr-2" />
          {isSyncing ? "Syncing" : "Start Sync"}
        </button>
        
        <button
          onClick={stopSync}
          disabled={!isSyncing}
          className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Square className="h-5 w-5 mr-2" />
          Stop Sync
        </button>
      </div>
    </div>
  );
}