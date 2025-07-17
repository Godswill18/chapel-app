import React from 'react';
import { Trophy, Crown, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Card from './Card';

const WinnerCard = ({ winner, totalVotes, voteCategory, endTime }) => {
  const votingEnded = new Date(endTime) < new Date();
  const isPublished = winner !== null;

  if (!votingEnded) {
    return (
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="p-6 text-center">
          <Clock className="h-12 w-12 text-blue-400 dark:text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Voting Still Active
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            Results will be available after voting ends on {new Date(endTime).toLocaleString()}
          </p>
        </div>
      </Card>
    );
  }

  if (!isPublished) {
    return (
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-400 dark:text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Results Pending
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            The results for {voteCategory} are being finalized and will be published soon.
          </p>
        </div>
      </Card>
    );
  }

  const fullName = `${winner.user?.firstName || ''} ${winner.user?.lastName || ''}`.trim();
  const initials = (winner.user?.firstName?.charAt(0) || '') + (winner.user?.lastName?.charAt(0) || '') || 'U';

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Official Results
            </span>
          </div>
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {voteCategory}
          </span>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mb-4">
              {winner.user?.profileImg ? (
                <img 
                  src={`${import.meta.env.VITE_BACKEND_API_URL || ''}${winner.user.profileImg.startsWith('/') ? '' : '/'}${winner.user.profileImg}`}
                  alt="Winner" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.textContent = initials;
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="absolute -top-2 -right-2 bg-purple-500 dark:bg-purple-600 rounded-full p-2">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">
            {fullName || 'Unknown User'}
          </h3>
          <p className="text-purple-600 dark:text-purple-300 mb-4">
            Winner of {voteCategory}
          </p>

          <div className="flex items-center justify-center space-x-2 bg-purple-100 dark:bg-purple-900/50 px-4 py-2 rounded-full">
            <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-purple-800 dark:text-purple-200">
              {winner.voteCount} votes ({winner.percentage}%)
            </span>
          </div>

          <p className="text-purple-600 dark:text-purple-300 mt-2">
            {totalVotes} total votes cast in this category
          </p>

          {winner.description && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 italic">
              "{winner.description}"
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WinnerCard;