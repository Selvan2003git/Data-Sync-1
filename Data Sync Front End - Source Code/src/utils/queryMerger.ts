import { QueryResult, MergeConfig, MergedResult } from '../types/queryResult';

export function mergeQueryResults(results: QueryResult[], config: MergeConfig): MergedResult {
  const timestamp = new Date();
  let mergedData: any[] = [];

  switch (config.type) {
    case 'union':
      mergedData = mergeUnion(results, config.key);
      break;
    case 'intersection':
      mergedData = mergeIntersection(results, config.key);
      break;
    case 'custom':
      mergedData = config.customLogic ? config.customLogic(results) : [];
      break;
  }

  return {
    results,
    mergedData,
    timestamp
  };
}

function mergeUnion(results: QueryResult[], key?: string): any[] {
  if (!results.length) return [];
  
  if (key) {
    // Merge by key, removing duplicates
    const merged = new Map();
    results.forEach(result => {
      result.data.forEach(item => {
        if (item[key] !== undefined) {
          merged.set(item[key], item);
        }
      });
    });
    return Array.from(merged.values());
  }
  
  // Simple union of all results
  return results.flatMap(result => result.data);
}

function mergeIntersection(results: QueryResult[], key?: string): any[] {
  if (!results.length) return [];
  
  if (key) {
    // Find records that exist in all results with matching keys
    const keyMaps = results.map(result => 
      new Set(result.data.map(item => item[key]))
    );
    
    const commonKeys = Array.from(keyMaps[0]).filter(key =>
      keyMaps.every(map => map.has(key))
    );
    
    return commonKeys.map(commonKey => {
      const matchingRecords = results.map(result =>
        result.data.find(item => item[key] === commonKey)
      );
      return Object.assign({}, ...matchingRecords);
    });
  }
  
  // Without key, return only records that are identical across all results
  const stringified = results[0].data.map(item => JSON.stringify(item));
  return results[0].data.filter((_, index) =>
    results.every(result =>
      JSON.stringify(result.data[index]) === stringified[index]
    )
  );
}