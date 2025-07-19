import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

export const useAnnouncementStore = create(
  devtools((set) => ({
    announcements: [],
    pinnedAnnouncements: [],
    regularAnnouncements: [],
    loading: false,
    error: null,

    fetchAnnouncements: async () => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}api/announcements/getUserAnnouncements`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (!Array.isArray(res.data)) {
          throw new Error('Invalid response: Expected an array');
        }

        // Separate pinned and regular announcements
        const pinned = res.data.filter(a => a.pinned);
        const regular = res.data.filter(a => !a.pinned);

        set({ 
          announcements: res.data,
          pinnedAnnouncements: pinned,
          regularAnnouncements: regular,
          loading: false 
        });

      } catch (err) {
        console.error('Fetch error:', err);
        set({
          loading: false,
          error: err.response?.data?.message || err.message || 'Failed to fetch announcements',
        });
      }
    },

    filterAnnouncements: (searchTerm, category) => {
      set((state) => {
        const filtered = state.announcements.filter(announcement => {
          const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = category === 'all' || announcement.category === category;
          return matchesSearch && matchesCategory;
        });

        return {
          pinnedAnnouncements: filtered.filter(a => a.pinned),
          regularAnnouncements: filtered.filter(a => !a.pinned)
        };
      });
    }
  }))
);