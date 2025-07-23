// In your store file (e.g., useUserStore.js)
import { create } from 'zustand';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://wsu-chapel.onrender.com/'

export const useUserStore = create((set) => ({
  users: [],
  birthdays: [],
  loading: false,
  error: null,

  // Get all users with their birthdays
fetchBirthdays: async () => {
  set({ loading: true, error: null });
  try {
    const res = await fetch(`${API_URL}api/users/getBirthdays`, {
          method: 'GET',
        credentials: 'include',
    });
    const data = await res.json();
    
    if (res.ok && data.success) {
      set({ birthdays: data.birthdays, loading: false });
      return data.birthdays;
    }
    throw new Error(data.message);
  } catch (err) {
    set({ error: err.message, loading: false });
    throw err;
  }
},

 
}));