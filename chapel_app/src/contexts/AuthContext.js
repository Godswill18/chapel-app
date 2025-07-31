import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://wsu-chapel.onrender.com/'

 export const useUserContext = create((set) => ({
    userContext: [],
    loading: false,
    error: null,
    
    setUserContext: (userContext) => set({userContext}),

    registerUser: async (newUser) => {
        try{
             // strip confirmPassword before sending
            const { confirmPassword, ...payload } = newUser;

                //  console.log("Payload being sent:", payload); // Add this line to inspect the payload


            const res = await fetch(`${API_URL}api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // include cookies in the request,
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if(res.ok && data.success){
                set((state) => ({
                    userContext: Array.isArray(state.userContext)
                        ? [...state.userContext, data.data]
                        : [data.data], // Ensure userContext remains an array
                }));
                return { success: true, message: data.message};
            }else {
                return { success: false, message: data.message || "User registration failed." };
            }

        }catch (error){
            console.error("Error creating account:", error);
            return { success: false, message: "A network or server error occurred. Please try again later." };
        }
    },

    // loginUser: async (login) => {
    //     try{
    //         const res = await fetch('http://localhost:5000/api/auth/login', {
    //             method: 'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(login),
    //             credentials: 'include'
    //         });

    //         if(!res.ok) throw new Error("Login Failed");

    //         const data = await res.json();
    //         return { success: true, message: "Login Successful", data};
            

    //     }catch(error){
    //         console.log("Login Error",error);
    //         return {success: false, message: "Server error."};

    //     }
    // }

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
      // console.log('Login response:', data); // Debug

      if (res.ok && data.success) {
        // ✅ Save token if backend sends it
        if (data.token) {
          sessionStorage.setItem('token', data.token); // Store in sessionStorage (cleared when tab/browser closes)
          // localStorage.setItem('token', data.token); // Store in localStorage (persistent across sessions)
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
  // Prioritize sessionStorage, fall back to localStorage
  const token = sessionStorage.getItem('token')
  //  || localStorage.getItem('token');
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
      sessionStorage.removeItem('token'); // Clear sessionStorage
      // localStorage.removeItem('token'); // Clear localStorage
      useAuthStore.getState().logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return res;
  } catch (err) {
    throw err;
  }
},


 queryKey: ["authUser"], // we use the querykey to give a unique name to our query and refer to it later
getUser: async () => {
  try {
    const res = await fetch(`${API_URL}api/auth/me`, {
      method: 'GET',
      credentials: 'include' // Always include credentials
    });

    if (res.status === 401) {
      // Clear any invalid tokens
      // localStorage.removeItem('token');
      throw new Error('Unauthorized');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
    
    // Store token in localStorage as fallback
    if (data.token) {
      sessionStorage.setItem('token', data.token); // session storage is set because of IOS browsers 
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
    // localStorage.removeItem('token'); // Clear localStorage
    sessionStorage.removeItem('token'); // Clear sessionStorage
    set({ user: null, token: null, isAuthenticated: false });
    useAuthStore.getState().logout();
    return res.ok
      ? { success: true }
      : { success: false, message: 'Logout failed on server' };
  } catch (err) {
    console.error('Logout Error', err);
    // localStorage.removeItem('token'); // Clear localStorage
    sessionStorage.removeItem('token'); // Clear sessionStorage
    set({ user: null, token: null, isAuthenticated: false });
    useAuthStore.getState().logout();
    return { success: false, message: 'Network error during logout.' };
  }
}


    




}))


export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: (user, token) => set({ user, token, isAuthenticated: true, loading: false, error: null }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, loading: false, error: null }),
    }),
    {
      name: 'auth-storage', // Stores in localStorage
      getStorage: () => sessionStorage,
    }
  )
);

// export default useUserContext;