import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://wsu-chapel.onrender.com/'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: (user, token) => set({ user, token, isAuthenticated: true, loading: false, error: null }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, loading: false, error: null }),

      registerUser: async (newUser) => {
        try {
          // strip confirmPassword before sending
          const { confirmPassword, ...payload } = newUser;

          const res = await fetch(`${API_URL}api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // include cookies in the request,
            body: JSON.stringify(payload)
          });

          const data = await res.json();

          if (res.ok && data.success) {
            set((state) => ({
              user: Array.isArray(state.user)
                ? [...state.user, data.data]
                : [data.data], // Ensure user remains an array
            }));
            return { success: true, message: data.message };
          } else {
            return { success: false, message: data.message || "User registration failed." };
          }

        } catch (error) {
          console.error("Error creating account:", error);
          return { success: false, message: "A network or server error occurred. Please try again later." };
        }
      },

      loginUser: async (payload) => {
        try {
          const res = await fetch(`${API_URL}api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: 'include', // ✅ allows cookies
          });

          const data = await res.json().catch(() => ({})); // prevent JSON parse crash

          if (res.ok && data.success) {
            if (data.token) {
              localStorage.setItem('token', data.token);
            } else {
              console.warn('No token in login response');
            }

            return { success: true, message: data.message, data };
          }

          return { success: false, message: data.message || 'Invalid email or password.' };
        } catch (err) {
          console.error('Login Error', err);
          return { success: false, message: 'Network error.' };
        }
      },

      fetchWithAuth: async (url, options = {}) => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        try {
          const res = await fetch(url, { ...options, headers });
          if (res.status === 401) {
            localStorage.removeItem('token');
            useAuthStore.getState().logout();
            window.location.href = '/login';
            throw new Error('Unauthorized');
          }
          return res;
        } catch (err) {
          throw err;
        }
      },

      queryKey: ["authUser"],
      getUser: async () => {
        try {
          const res = await fetch(`${API_URL}api/auth/me`, {
            method: 'GET',
            credentials: 'include'
          });

          if (res.status === 401) {
            throw new Error('Unauthorized');
          }

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to fetch user');

          if (data.token) {
            localStorage.setItem('token', data.token);
          }

          return data;
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          throw error;
        }
      },

      logoutUser: async () => {
        try {
          const res = await fetch(`${API_URL}api/auth/logout`, { method: 'POST' });
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false });
          useAuthStore.getState().logout();
          return res.ok
            ? { success: true }
            : { success: false, message: 'Logout failed on server' };
        } catch (err) {
          console.error('Logout Error', err);
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false });
          useAuthStore.getState().logout();
          return { success: false, message: 'Network error during logout.' };
        }
      },

    }),
    {
      name: 'auth-storage', // Stores in localStorage
    }
  )
);


// export const useAuthStore = create(
  // persist(
  //   (set, get) => ({
  //     user: null,
  //     token: null,
  //     isAuthenticated: false,
  //     loading: false,
  //     error: null,

  //     login: (user, token) => set({ user, token, isAuthenticated: true, loading: false, error: null }),
  //     logout: () => set({ user: null, token: null, isAuthenticated: false, loading: false, error: null }),
  //   }),
//     {
//       name: 'auth-storage', // Stores in localStorage
//       getStorage: () => localStorage,
//     }
//   )
// );

// export default useUserContext;