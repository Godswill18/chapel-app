import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

export const useCalendarStore = create(
  devtools((set, get) => ({
    events: [],
    loading: false,
    error: null,

    // Fetch all calendar events
    fetchEvents: async () => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/calendar/chapel-events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (!Array.isArray(res.data)) {
          throw new Error('Invalid response: Expected an array');
        }

        set({ events: res.data, loading: false });

      } catch (err) {
        console.error('Fetch error:', err);
        set({
          loading: false,
          error: err.response?.data?.message || err.message || 'Failed to fetch calendar events',
        });
      }
    },

    // (Optional) Add a method to fetch events by date range
    fetchEventsByDateRange: async (startDate, endDate) => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/calendar/events`, {
          params: { startDate, endDate },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (!Array.isArray(res.data)) {
          throw new Error('Invalid response: Expected an array');
        }

        set({ events: res.data, loading: false });

      } catch (err) {
        console.error('Fetch error:', err);
        set({
          loading: false,
          error: err.response?.data?.message || err.message || 'Failed to fetch events',
        });
      }
    },
  }))
);