import { v4 as uuidv4 } from 'uuid';
import type { QueryConfig } from '../types/config';
import { useQueryStore } from '../stores/queryStore';

export function useQueries() {
  const { queries, addQuery: addQueryToStore, removeQuery: removeQueryFromStore, updateQuery: updateQueryInStore } = useQueryStore();

  const addQuery = (query: Omit<QueryConfig, 'id'>) => {
    const newQuery = {
      ...query,
      id: uuidv4()
    };
    addQueryToStore(newQuery);
  };

  const removeQuery = (queryId: string) => {
    removeQueryFromStore(queryId);
  };

  const updateQuery = (queryId: string, updatedQuery: QueryConfig) => {
    updateQueryInStore(queryId, updatedQuery);
  };

  return {
    queries,
    addQuery,
    removeQuery,
    updateQuery
  };
}