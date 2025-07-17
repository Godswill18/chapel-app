import React, { useEffect, useState } from 'react';
import { Clock, Vote, Award } from 'lucide-react';
import Card from '../components/Card';
import useVoteStore from '../contexts/voteStore';
import { toast, ToastContainer } from 'react-toastify';
import VotesSkeleton from '../skeletoon/VotesSkeleton';
import WinnerCard from '../components/WinnerCard';

const Votes = () => {
  const {
    votes,
    publishedWinners,
    loading,
    fetchPublishedWinners,
    getWinnerFromVote,
    fetchVotes,
    submitVote
  } = useVoteStore();
  
  const [selectedVote, setSelectedVote] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [votingEnded, setVotingEnded] = useState(false);


  // Find the first active vote if none selected
 const currentVote = selectedVote || votes?.[0];


  // Calculate and update time remaining every second
  useEffect(() => {
    const updateCountdown = () => {
      if (!currentVote?.endTime) return;
      
      const now = new Date();
      const endTime = new Date(currentVote.endTime);
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        setVotingEnded(true);
        setTimeRemaining('Voting has ended');
        return;
      }

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      // Format the countdown string
      let countdownStr = '';
      if (days > 0) countdownStr += `${days}d `;
      if (hours > 0 || days > 0) countdownStr += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) countdownStr += `${minutes}m `;
      countdownStr += `${seconds}s`;

      setTimeRemaining(countdownStr);
      setVotingEnded(false);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentVote]);

useEffect(() => {
    fetchVotes();
    fetchPublishedWinners();
  }, [fetchVotes, fetchPublishedWinners]);

  const hasPublishedResults = currentVote?.resultPublished || 
  publishedWinners[currentVote?._id]

  const handleVote = async (voteId, nomineeId) => {
    try {
      await submitVote(voteId, nomineeId);
      toast.success('Your vote has been submitted!');
      fetchVotes(); // Refresh votes to update userHasVoted status
    } catch (err) {
      toast.error(err.message || 'Failed to submit vote');
    }
  };

  if (loading && !votes?.length) {
    return <VotesSkeleton/>;
  }

  if (!votes?.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No voting categories available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are currently no voting categories. Please check back later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer />
      
      {/* Vote Category Selector */}
      {votes.length > 0 && (
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Select Voting Category</h2>
            <div className="flex flex-wrap gap-2">
              {votes.map(vote => (
                <button
                  key={vote._id}
                  onClick={() => setSelectedVote(vote)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    currentVote?._id === vote._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {vote.category}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Current Vote Info */}
      {currentVote && (
        <>
          <Card className="mb-8 border-l-4 border-l-blue-500">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {currentVote.category}
                  </h2>
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        Voting ends in:
                      </span>
                      <Clock className="h-6 w-6 text-blue-500" />
                      <span className="text-3xl font-bold text-gray-900 dark:text-red-500">
                        {timeRemaining}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    !votingEnded
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {!votingEnded ? 'Voting Active' : 'Voting Closed'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
                {hasPublishedResults && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-6 text-center">
      {currentVote.category} Winner
    </h2>
    <WinnerCard 
      winner={publishedWinners[currentVote._id] || getWinnerFromVote(currentVote)}
      totalVotes={currentVote.voters?.length || 0}
      voteCategory={currentVote.category}
      endTime={currentVote.endTime}
    />
    {/* {console.log('Published Winners:', publishedWinners)} */}
  </div>
)}

          {/* Voting Status */}
          {currentVote.userHasVoted ? (
            <Card className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="p-6 text-center">
                <Award className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Thank you for voting in this category!
                </h3>
                <p className="text-green-700 dark:text-green-300 mt-2">
                  Results will be announced after voting ends.
                </p>
              </div>
            </Card>
          ) : votingEnded ? (
            <Card className="mb-8 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
              <div className="p-6 text-center">
                <Award className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Voting has ended
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Results will be announced soon.
                </p>
              </div>
            </Card>
          ) : null}

          {/* Nominees List */}
          <div className="space-y-6">
            {currentVote.nominees?.map((nominee) => {
              // Check if nominee.user exists and has the properties we need
              const user = nominee.user || {};
              const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
              const initials = (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '') || 'U';
              
              return (
                <Card 
                  key={nominee._id} 
                  className={`border-2 transition-all duration-200 ${
                    currentVote.userHasVoted && nominee.voteCount > 0
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {user.profileImg ? (
                            <img 
                              src={`${import.meta.env.VITE_BACKEND_API_URL || ''}${user.profileImg.startsWith('/') ? '' : '/'}${user.profileImg}`}
                              alt="Profile" 
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
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {fullName || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.position || 'No position'} • {user.department || 'No department'}
                            </p>
                          </div>
                          {!votingEnded && !currentVote.userHasVoted && (
                            <button
                              onClick={() => handleVote(currentVote._id, nominee._id)}
                              disabled={loading}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                                loading
                                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                              }`}
                            >
                              <Vote className="h-4 w-4" />
                              <span>{loading ? 'Submitting...' : 'Vote'}</span>
                            </button>
                          )}
                          {currentVote.userHasVoted && nominee.voteCount > 0 && (
                            <div className="text-sm font-medium text-green-600 dark:text-green-400">
                              Your Vote
                            </div>
                          )}
                        </div>
                        
                        {nominee.description && (
                          <p className="text-gray-700 dark:text-gray-300">
                            {nominee.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
};

export default Votes;