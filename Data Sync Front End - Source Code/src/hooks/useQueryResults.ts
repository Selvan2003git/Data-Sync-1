import { create } from 'zustand';
import { QueryResult, MergedResult } from '../types/queryResult';

interface QueryResultsStore {
  results: Record<string, QueryResult[]>;
  addResult: (queryId: string, result: QueryResult) => void;
  clearResults: (queryId: string) => void;
  getResults: (queryId: string) => QueryResult[];
}

export const useQueryResults = create<QueryResultsStore>((set, get) => ({
  results: {},
  addResult: (queryId, result) => set((state) => ({
    results: {
      ...state.results,
      [queryId]: [...(state.results[queryId] || []), result]
    }
  })),
  clearResults: (queryId) => set((state) => {
    const newResults = { ...state.results };
    delete newResults[queryId];
    return { results: newResults };
  }),
  getResults: (queryId) => get().results[queryId] || []
}));