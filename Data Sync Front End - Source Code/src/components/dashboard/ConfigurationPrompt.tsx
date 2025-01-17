import React, { useRef } from 'react';
import { Upload, Download, Database, ServerCog, Settings ,HelpCircle} from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadSampleConfig } from '../../utils/configSample';
import { importConfiguration } from '../../utils/configImport';

export default function ConfigurationPrompt() {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importConfiguration(file);
      alert('Configuration imported successfully');
    } catch (error) {
      alert('Error importing configuration. Please check the file format.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Welcome to Data Sync</h2>
      
      <div className="space-y-6">
        <div className="flex gap-4">
          <label className="flex-1">
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange = {handleImport}
              
            />
            <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <Upload className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Upload Configuration</span>
            </div>
          </label>
          
          <button
            onClick={downloadSampleConfig}
            className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <Download className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Download Sample Format</span>
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Or configure manually through:</p>
          <div className="grid grid-cols-3 gap-4">
            <Link
              to="/queries"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Database className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Queries</span>
            </Link>
            
            <Link
              to="/servers"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ServerCog className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Servers</span>
            </Link>
            
            <Link
              to="/settings"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </Link>
          
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-4">See the Help Page:</p>
        <Link
              to="/help"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <HelpCircle className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-">Help</span>
            </Link>




        </div>

               

        
      </div>
    </div>
  );
}