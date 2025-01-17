import { v4 as uuidv4 } from 'uuid';
import { useServerStore } from '../stores/serverStore';
import { useQueryStore } from '../stores/queryStore';
import { useZohoStore } from '../stores/zohoStore';
import { useTargetStore } from '../stores/targetStore';
import type { ServerConfig, QueryConfig, TargetConfig } from '../types/config';

interface ImportedConfig {
  servers: ServerConfig[];
  queries: QueryConfig[];
  'zoho analytics configuration': TargetConfig;
}

export async function importConfiguration(file: File): Promise<void> {
  try {
    const text = await file.text();
    const config: ImportedConfig = JSON.parse(text);
    
    const serverStore = useServerStore.getState();
    const queryStore = useQueryStore.getState();
    const zohoStore = useTargetStore.getState();

    // Clear existing configurations
    serverStore.clearServers();
    queryStore.clearQueries();

    // Import servers with new IDs
    if (Array.isArray(config.servers)) {
      config.servers.forEach(server => {
        serverStore.addServer({
          ...server,
          accessToken : "",
          expiryTime : 0,
          id: uuidv4() // Generate new unique ID
        });
      });
      
     
    }

    // Import queries with new IDs
    if (Array.isArray(config.queries)) {
      config.queries.forEach(query => {
        queryStore.addQuery({
          ...query,
          id: uuidv4() // Generate new unique ID
        });
      });
    }

    // Import Zoho configuration
    if (config['zoho analytics configuration']) {
      //console.log("yess");
      zohoStore.updateConfig(config['zoho analytics configuration']);
    }
  } catch (error) {
    console.error('Error importing configuration:', error);
    throw new Error('Invalid configuration file');
  }
}