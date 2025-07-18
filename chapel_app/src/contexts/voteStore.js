import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

const useVoteStore = create((set, get) => ({
  // Fetch all votes
  votes: [],
  publishedWinners: [],
  loading: false,
  error: null,
  timeRemaining: '',
  votingEnded: false,
  selectedVoteId: null,

  // Fetch all votes with populated nominee data
  fetchVotes: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/votes/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include'
      });

      const now = new Date();
      const activeVote = response.data.votes.find(vote => 
        new Date(vote.startTime) <= now && 
        new Date(vote.endTime) >= now
      );

      set({ 
        votes: response.data.votes,
        selectedVoteId: activeVote?._id || null,
        loading: false 
      });

      if (activeVote) {
        get().startCountdown(activeVote.endTime);
      }
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  // Set currently selected vote
  setSelectedVote: (voteId) => {
    const vote = get().votes.find(v => v._id === voteId);
    if (vote) {
      set({ selectedVoteId: voteId });
      const now = new Date();
      const endDate = new Date(vote.endTime);
      if (now <= endDate) {
        get().startCountdown(vote.endTime);
      } else {
        set({ votingEnded: true, timeRemaining: 'Voting ended' });
      }
    }
  },

  // Start countdown timer
  startCountdown: (endTime) => {
    // Clear any existing interval
    if (get().countdownInterval) {
      clearInterval(get().countdownInterval);
    }

    const updateTimer = () => {
      const now = new Date();
      const endDate = new Date(endTime);
      const diffTime = endDate.getTime() - now.getTime();
      
      if (diffTime <= 0) {
        set({ timeRemaining: 'Voting ended', votingEnded: true });
        clearInterval(interval);
        return;
      }
      
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      let timeString = '';
      if (diffDays > 0) timeString += `${diffDays}d `;
      if (diffHours > 0 || diffDays > 0) timeString += `${diffHours}h `;
      if (diffMinutes > 0 || diffHours > 0 || diffDays > 0) timeString += `${diffMinutes}m `;
      timeString += `${diffSeconds}s`;
      
      set({ 
        timeRemaining: timeString.trim(),
        votingEnded: false
      });
    };
    
    updateTimer(); // Initial update
    const interval = setInterval(updateTimer, 1000); // Update every second
    
    set({ countdownInterval: interval });
  },

  // Submit a vote
  submitVote: async (voteId, nomineeId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_URL}/votes/voteUser`, {
        voteId,
        nomineeId
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        credentials: 'include'
      });
      
      // Update the specific vote in our store
      set(state => ({
        votes: state.votes.map(vote => 
          vote._id === voteId ? response.data.vote : vote
        ),
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Get currently selected vote
  getSelectedVote: () => {
    const { votes, selectedVoteId } = get();
    return votes.find(vote => vote._id === selectedVoteId);
  },

  // Get user's vote for selected category
  getUserVote: () => {
    const selectedVote = get().getSelectedVote();
    if (!selectedVote || !selectedVote.userHasVoted) return null;
    
    // Find which nominee the user voted for
    const userId = localStorage.getItem('userId'); // You'll need to store this on login
    // This assumes your backend includes the user's vote in the response
    return selectedVote.userVoteId;
  },
fetchPublishedWinners: async () => {
  set({ loading: true, error: null });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/votes/winners`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
      credentials: 'include'
    });

    // Process winners data
    const processedWinners = {};
    response.data.winners.forEach(winner => {
      processedWinners[winner.voteId] = {
        user: winner.user,
        voteCount: winner.voteCount,
        percentage: winner.percentage,
        category: winner.category
      };
    });

    set({ 
      publishedWinners: processedWinners,
      loading: false 
    });
  } catch (error) {
    set({ 
      error: error.response?.data?.message || error.message,
      loading: false 
    });
  }
},

// Add a helper function to get winner from vote data
getWinnerFromVote: (vote) => {
  if (!vote || !vote.nominees || vote.nominees.length === 0) return null;
  
  const topNominee = vote.nominees.reduce((max, current) => 
    current.voteCount > max.voteCount ? current : max, 
    vote.nominees[0]
  );
  
  const totalVotes = vote.nominees.reduce((sum, nominee) => sum + nominee.voteCount, 0);
  const percentage = totalVotes > 0 ? Math.round((topNominee.voteCount / totalVotes) * 100) : 0;
  
  return {
    user: topNominee.user,
    voteCount: topNominee.voteCount,
    percentage,
    category: vote.category
  };
},

  // Cleanup on unmount
  cleanup: () => {
    if (get().countdownInterval) {
      clearInterval(get().countdownInterval);
    }
  }
}));

export default useVoteStore;