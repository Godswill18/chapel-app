import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include' // ✅ allows cookies
    });

    const data = await res.json().catch(() => ({})); // prevent JSON parse crash

    if (res.ok && data.success) {
      // ✅ Save token if backend sends it
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return { success: true, message: data.message, data };
    }

    return { success: false, message: data.message || 'Login failed.' };

  } catch (err) {
    console.error('Login Error', err);
    return { success: false, message: 'Network error.' };
  }
},


 queryKey: ["authUser"], // we use the querykey to give a unique name to our query and refer to it later
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

    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    // Clear invalid credentials
    localStorage.removeItem('token');
    throw error;
  }
},

 logoutUser: async () => {
  try {
    const res = await fetch(`${API_URL}api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    // Clear local data regardless of backend response
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });

    // Also clear Zustand persisted auth store
    useAuthStore.getState().logout();

    return res.ok
      ? { success: true }
      : { success: false, message: 'Logout failed on server' };

  } catch (err) {
    console.error('Logout Error', err);

    // Still clear state even if network fails
    localStorage.removeItem('token');
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
      getStorage: () => localStorage,
    }
  )
);

// export default useUserContext;