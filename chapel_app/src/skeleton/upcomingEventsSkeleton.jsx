import React from 'react';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';

export const UpcomingEventsSkeleton = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Event Skeletons */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
            {/* Title and type indicator */}
            <div className="flex items-start justify-between mb-3">
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>

            {/* Date, time, location */}
            <div className="space-y-2">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-2 text-gray-200 dark:text-gray-700" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-2 text-gray-200 dark:text-gray-700" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-2 text-gray-200 dark:text-gray-700" />
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};