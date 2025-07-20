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
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}api/auth/login`, {
      method: 'POST',
       headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
      withCredentials: true,
      credentials: "include",
    });

    const data = await res.json();          // always parse

    if (res.ok && data.success) {
      return { success: true, message: data.message, data };
    }

    // handles 400, 403, 500, etc. – whatever the server sent
    return { success: false, message: data.message || data.error || 'Login failed.' };

  } catch (err) {
    console.error('Login Error', err);
    return { success: false, message: 'Network error.' };
  }
},

 queryKey: ["authUser"], // we use the querykey to give a unique name to our query and refer to it later
getUser: async () => {
  try{
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}api/auth/me`, {
      method: "GET",
       headers: {
            Authorization: `Bearer ${token}`,
          },
      withCredentials: true,
      credentials: "include",
    });

    const data = await res.json();
        if(data.error) return null; // If there's an error, return null to indicate no user is authenticated

        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        // console.log( "auth user:",data);
        return data;
      }catch (error){
        console.error("Error fetching user data:", error);
        throw new Error(error);
      }
    },

   // Inside useUserContext
    logoutUser: async () => {
      try {
        const res = await fetch(`${API_URL}api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          const data = await res.json();
          console.log('Backend logout failed:', data);
        }

        // Clear frontend state
        useAuthStore.getState().logout();

        return { success: true };
      } catch (err) {
        console.error('Logout Error', err);
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