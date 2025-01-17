import React from 'react';
import { useTargetStore } from '../../stores/targetStore';

export default function FrequencySettings() {
  const { config, updateConfig } = useTargetStore();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Sync Frequency</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Frequency</label>
          <div className="mt-1 flex space-x-4">
            <input
              type="number"
              min="1"
              value={config.frequency}
              onChange={(e) => updateConfig({ frequency: parseInt(e.target.value) || 1 })}
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <select
              value={config.format}
              onChange={(e) => updateConfig({ format: e.target.value as 'days' | 'hours' })}
              className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}