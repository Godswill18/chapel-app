import React from 'react';
import Card from '../components/Card'; // Ensure Card wraps the same as real content

const RequestSkeleton = () => {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-2/3 skeleton rounded"></div>
        <div className="h-5 w-20 skeleton rounded-full"></div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 w-full skeleton rounded"></div>
        <div className="h-4 w-11/12 skeleton rounded"></div>
        <div className="h-4 w-10/12 skeleton rounded"></div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 skeleton rounded-full"></div>
            <div className="h-4 w-20 skeleton rounded"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 skeleton rounded-full"></div>
            <div className="h-4 w-24 skeleton rounded"></div>
          </div>
        </div>
        <div className="h-4 w-16 skeleton rounded"></div>
      </div>
    </Card>
  );
};

export default RequestSkeleton;
