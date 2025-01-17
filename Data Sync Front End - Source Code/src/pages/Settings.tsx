import React from 'react';
import { Save, Download } from 'lucide-react';
import { exportConfiguration } from '../utils/configExport';
import { useTargetStore } from '../stores/targetStore';
import FrequencySettings from '../components/settings/FrequencySettings';
import ImportConfig from '../components/ImportConfig';

export default function Settings() {
  const { config: targetConfig, updateConfig } = useTargetStore();

  const handleSave = () => {
    // Save target configuration
    updateConfig(targetConfig);
    alert('Settings saved successfully!');
  };

  const handleExport = () => {
    exportConfiguration();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="flex space-x-4">
          <ImportConfig />
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Configuration
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <FrequencySettings />
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Target Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization ID</label>
              <input
                type="text"
                value={targetConfig.orgId}
                onChange={(e) => updateConfig({ orgId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Workspace ID</label>
              <input
                type="text"
                value={targetConfig.workspaceId}
                onChange={(e) => updateConfig({ workspaceId: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Client ID</label>
              <input
                type="text"
                value={targetConfig.clientId}
                onChange={(e) => updateConfig({ clientId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Client Secret</label>
              <input
                type="password"
                value={targetConfig.clientSecret}
                onChange={(e) => updateConfig({ clientSecret: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Refresh Token</label>
              <input
                type="password"
                value={targetConfig.refreshToken}
                onChange={(e) => updateConfig({ refreshToken: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}