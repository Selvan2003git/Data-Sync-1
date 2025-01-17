import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ActivityItemProps {
  isLast: boolean;
}

export default function ActivityItem({ isLast }: ActivityItemProps) {
  return (
    <div className="relative pb-8">
      {!isLast && (
        <span
          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
      )}
      <div className="relative flex space-x-3">
        <div>
          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
            <CheckCircle className="h-5 w-5 text-white" />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
          <div>
            <p className="text-sm text-gray-500">
              Query <span className="font-medium text-gray-900">Sales Data</span> completed successfully
            </p>
          </div>
          <div className="whitespace-nowrap text-right text-sm text-gray-500">
            3m ago
          </div>
        </div>
      </div>
    </div>
  );
}