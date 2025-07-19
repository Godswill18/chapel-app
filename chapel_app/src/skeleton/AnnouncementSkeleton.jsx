import React from 'react';

export const AnnouncementSkeleton = ({ isPinned = false }) => {
  return (
    <div className={`border rounded-lg p-6 mb-6 ${isPinned ? 'border-l-4 border-l-blue-500' : ''}`}>
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isPinned && <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>}
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-6">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const EmptyStateSkeleton = () => {
  return (
    <div className="border rounded-lg p-12 text-center animate-pulse">
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
      <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
    </div>
  );
};