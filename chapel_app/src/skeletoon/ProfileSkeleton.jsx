import React from 'react'
import Card from '../components/Card'

const ProfileSkeleton = () => {
  return (
      <div className="animate-pulse space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
      <div className="flex space-x-3 mt-4 sm:mt-0">
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>

    {/* Profile Image Card */}
    <Card>
      <div className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-3 w-full sm:w-auto">
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="flex space-x-2">
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </Card>

    {/* Personal Info Form */}
    <Card>
      <div className="p-6 space-y-6">
        <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
          ))}
          <div className="md:col-span-2 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="md:col-span-2 h-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </Card>

    {/* Emergency Contact */}
    <Card>
      <div className="p-6 space-y-6">
        <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    </Card>
  </div>
  )
}

export default ProfileSkeleton