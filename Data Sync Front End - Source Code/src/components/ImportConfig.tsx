import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { importConfiguration } from '../utils/configImport';

export default function ImportConfig() {
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
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        <Upload className="w-5 h-5 mr-2" />
        Import Configuration
      </button>
    </div>
  );
}