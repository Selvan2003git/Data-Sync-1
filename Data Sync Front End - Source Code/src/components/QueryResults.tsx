import React, { useState } from 'react';
import { MergeConfig, QueryResult } from '../types/queryResult';
import { mergeQueryResults } from '../utils/queryMerger';

interface QueryResultsProps {
  results: QueryResult[];
}

export default function QueryResults({ results }: QueryResultsProps) {
  const [mergeConfig, setMergeConfig] = useState<MergeConfig>({
    type: 'union',
    key: ''
  });

  const mergedResults = mergeQueryResults(results, mergeConfig);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Merge Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Merge Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={mergeConfig.type}
              onChange={(e) => setMergeConfig({ ...mergeConfig, type: e.target.value as MergeConfig['type'] })}
            >
              <option value="union">Union</option>
              <option value="intersection">Intersection</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Merge Key</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={mergeConfig.key}
              onChange={(e) => setMergeConfig({ ...mergeConfig, key: e.target.value })}
              placeholder="Enter key field name"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Merged Results</h3>
        <div className="overflow-x-auto">
          <pre className="text-sm bg-gray-50 p-4 rounded">
            {JSON.stringify(mergedResults.mergedData, null, 2)}
          </pre>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Individual Server Results</h3>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={result.serverId} className="border rounded p-4">
              <h4 className="font-medium mb-2">Server: {result.serverId}</h4>
              <pre className="text-sm bg-gray-50 p-4 rounded">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}