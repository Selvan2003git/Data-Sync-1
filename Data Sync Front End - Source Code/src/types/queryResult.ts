export interface QueryResult {
  serverId: string;
  data: any[];
  timestamp: Date;
}

export interface MergeConfig {
  type: 'union' | 'intersection' | 'custom';
  key?: string; // Key to match records when merging
  customLogic?: (results: QueryResult[]) => any[];
}

export interface MergedResult {
  results: QueryResult[];
  mergedData: any[];
  timestamp: Date;
}