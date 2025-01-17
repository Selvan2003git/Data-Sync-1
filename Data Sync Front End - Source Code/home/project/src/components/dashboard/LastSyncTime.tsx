import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LastSyncTimeProps {
  lastSyncTime: Date | null;
}

export default function LastSyncTime({ lastSyncTime }: LastSyncTimeProps) {
  if (!lastSyncTime) {
    return (
      <div className="flex items-center text-gray-500">
        <Clock className="h-4 w-4 mr-1.5" />
        <span>No sync completed yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-gray-700">
      <Clock className="h-4 w-4 mr-1.5" />
      <span>Last synced: {format(lastSyncTime, 'MMM d, yyyy HH:mm:ss')}</span>
    </div>
  );
}