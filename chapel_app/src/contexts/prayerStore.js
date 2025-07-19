import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

export const usePrayerStore = create(
  devtools((set, get) => ({
    prayerRequests: [],
    loading: false,
    error: null,

    fetchPrayerRequests: async () => {
      set({ loading: true, error: null });

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}prayer/public-view`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          
        });

      if (!Array.isArray(res.data)) {
            throw new Error('Invalid response: Expected an array');
        }

        set({ prayerRequests: res.data, loading: false });

      } catch (err) {
        console.error('Fetch error:', err);
        set({
          loading: false,
          error:
            err.response?.data?.message ||
            err.message ||
            'Failed to fetch prayer requests',
        });
      }
    },

    sendPrayerRequest: async (formData) => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.post(`${API_URL}prayer/submitPrayerRequest`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        set({ prayerRequests: [data] });
        return { success: true, message: 'Prayer request submitted 🎉' };
      } catch (err) {
        return {
          success: false,
          message:
            err.response?.data?.message ||
            err.message ||
            'Could not submit prayer request',
        };
      }
    },


    togglePrayForRequest: async (prayerId) => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.post(
          `${API_URL}/prayer/${prayerId}/pray`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        set(state => ({
          prayerRequests: state.prayerRequests.map(request => 
            request._id === prayerId 
              ? { 
                  ...request, 
                  isPraying: data.isPraying 
                    ? [...request.isPraying, data.userId] 
                    : request.isPraying.filter(id => id !== data.userId),
                  prayerCount: data.prayerCount
                } 
              : request
          )
        }));

        return { success: true, isPraying: data.isPraying };
      } catch (err) {
        console.error('Prayer toggle error:', err);
        return {
          success: false,
          message: err.response?.data?.message || err.message || 'Failed to update prayer',
        };
      }
    },
  }))
);