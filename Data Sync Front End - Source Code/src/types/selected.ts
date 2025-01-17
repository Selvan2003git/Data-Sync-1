import { QueryConfig, ServerConfig } from './config';

export interface SelectedItems {
  queries: QueryConfig[];
  servers: ServerConfig[];
}

export interface SyncRequestBody {
  queries: QueryConfig[];
  servers: ServerConfig[];
}