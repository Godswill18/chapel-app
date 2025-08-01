import React from 'react';

// interface CardProps {
//   children: React.ReactNode;
//   className?: string;
//   hover?: boolean;
// }

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
        hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;