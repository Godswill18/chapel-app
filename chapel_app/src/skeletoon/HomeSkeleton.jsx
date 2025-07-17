import React from 'react';
import Card from '../components/Card';

const HomeSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Welcome Section Skeleton */}
      <div className="mb-8">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-8 h-40"></div>
      </div>

      {/* Carousel Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 w-full"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-600 mr-4"></div>
              <div>
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activities Skeleton */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start space-x-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Calendar Widget Skeleton */}
          <Card className="p-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </Card>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          {/* Quick Actions Skeleton */}
          <Card className="p-6">
            <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"></div>
              ))}
            </div>
          </Card>

          {/* Upcoming Birthdays Skeleton */}
          <Card className="p-6">
            <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;