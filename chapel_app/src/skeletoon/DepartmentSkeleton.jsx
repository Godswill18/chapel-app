import React from 'react'
import Card from '../components/Card'

const DepartmentSkeleton = () => {
  return (
    <Card key={'1'} className="p-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
    </Card>
  )
}

export default DepartmentSkeleton