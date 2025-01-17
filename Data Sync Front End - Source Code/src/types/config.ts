export interface ServerConfig {
  id: string;
  name: string;
  serverUrl: string;
  endpoint: string;
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  refreshToken: string;
  accessToken: string;
  expiryTime: number;
}

export interface QueryConfig {
  id: string;
  queryString: string;
  viewId: string;
  mergeType: 'consider_default' | 'consider_null' | 'ignore';
  numericDefault: number;
  stringDefault: string;
}

export interface TargetConfig {
  orgId: string;
  workspaceId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  frequency: number;
  format: 'days' | 'hours';
  accessToken: string;
  expiryTime: number;
}

export interface AppConfig {
  servers: ServerConfig[];
  queries: QueryConfig[];
  target: TargetConfig;
}