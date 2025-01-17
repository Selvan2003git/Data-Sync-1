import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QueryConfig } from '../types/config';
import { useSyncStore } from './syncStore';

interface QueryStore {
  queries: QueryConfig[];
  addQuery: (query: QueryConfig) => void;
  removeQuery: (queryId: string) => void;
  updateQuery: (queryId: string, updatedQuery: QueryConfig) => void;
  clearQueries: () => void;
}

export const useQueryStore = create<QueryStore>()(
  persist(
    (set) => ({
      queries: [],
      addQuery: (query) => {
        set((state) => ({ queries: [...state.queries, query] }));
        useSyncStore.getState().updateSelectedItems();
      },
      removeQuery: (queryId) => {
        set((state) => ({
          queries: state.queries.filter(q => q.id !== queryId)
        }));
        useSyncStore.getState().updateSelectedItems();
      },
      updateQuery: (queryId, updatedQuery) => {
        set((state) => ({
          queries: state.queries.map(q => 
            q.id === queryId ? { ...updatedQuery, id: queryId } : q
          )
        }));
        useSyncStore.getState().updateSelectedItems();
      },
      clearQueries: () => {
        set({ queries: [] });
        useSyncStore.getState().updateSelectedItems();
      }
    }),
    {
      name: 'query-storage'
    }
  )
);