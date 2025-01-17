import { useServerStore } from '../stores/serverStore';
import { useQueryStore } from '../stores/queryStore';
import type { TargetConfig } from '../types/config';
import { useTargetStore } from '../stores/targetStore';
import { sampleConfig } from './configSample';

export function exportConfiguration(zohoConfig: TargetConfig) {
  const servers = useServerStore.getState().servers;
  const queries = useQueryStore.getState().queries;
  const target = useTargetStore.getState().config;
  
  


  const config = {
    servers,
    queries,
    'zoho analytics configuration': target
  };

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data-integration-config.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}