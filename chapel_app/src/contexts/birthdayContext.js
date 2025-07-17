// In your store file (e.g., useUserStore.js)
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  users: [],
  birthdays: [],
  loading: false,
  error: null,

  // Get all users with their birthdays
fetchBirthdays: async () => {
  set({ loading: true, error: null });
  try {
    const res = await fetch('http://localhost:5000/api/users/getBirthdays', {
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