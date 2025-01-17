export interface QueryExecution {
  id: string;
  queryString: string;
  startTime: Date;
  servers: string[];
  status: 'running' | 'completed' | 'failed';
  viewId: number;
}

export interface ExecutionStore {
  activeExecutions: QueryExecution[];
  completedExecutions: QueryExecution[];
}