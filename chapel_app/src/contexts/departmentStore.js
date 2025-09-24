// stores/departmentStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://wsu-chapel.onrender.com/'

// const setupWindowListeners = (store) => {
//   const handleFocus = () => {
//     if (store.getState().user) {
//       store.getState().refreshAll();
//     }
//   };

//   const handleVisibilityChange = () => {
//     if (document.visibilityState === 'visible' && store.getState().user) {
//       store.getState().refreshAll();
//     }
//   };

//   // Add event listeners
//   window.addEventListener('focus', handleFocus);
//   document.addEventListener('visibilitychange', handleVisibilityChange);

//   // Return cleanup function
//   return () => {
//     window.removeEventListener('focus', handleFocus);
//     document.removeEventListener('visibilitychange', handleVisibilityChange);
//   };
// };

const useDepartmentStore = create((set, get) => ({
  departments: [],
  userDepartments: [],
  loading: false,
  error: null,
  user: null, // Add user to store for easier access

  // Initialize store
  init: (user) => {
    set({ user });
    // const cleanup = setupWindowListeners(useDepartmentStore);
    // return cleanup;
  },


  refreshAll: async () => {
  const { loading } = get();
  if (loading) return; // Prevent concurrent refreshes
  
//   console.log('Refreshing data on window focus...');
  const { fetchDepartments, fetchUserDepartments, user } = get();
  
  try {
    set({ loading: true });
    if (user?._id) {
      await Promise.all([
        fetchDepartments(),
        fetchUserDepartments(user._id)
      ]);
    } else {
      await fetchDepartments();
    }
  } finally {
    set({ loading: false });
  }
},

  // Fetch all departments
  fetchDepartments: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}api/departments/getDepartments`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          credentials: 'include'
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch departments');
      set({ departments: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  fetchDepartmentsList: async () => {
    set({ loading: true, error: null });
    try {
      // const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}api/departments/getAllDepartmentsName`,
        {
          method: 'GET',
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          // withCredentials: true,
          // credentials: 'include'
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch department list');
      set({ departments: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch user's departments
  fetchUserDepartments: async (userId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}api/departments/fetch-User-Departments/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          credentials: 'include',
        }
      );

      // Check the shape of response
      const departments = response.data.data || response.data;

      set({ 
        userDepartments: Array.isArray(departments) ? departments : [], 
        loading: false 
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Join a department
  joinDepartment: async (departmentId, userId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}api/departments/${departmentId}/join/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          withCredentials: true
        }
      );

       // Optimistically update the UI
    set((state) => ({
      userDepartments: [...state.userDepartments, { _id: departmentId }],
      departments: state.departments.map(dept => 
        dept._id === departmentId 
          ? { ...dept, members: [...dept.members, { _id: userId }] }
          : dept
      ),
      loading: false
    }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      throw error;
    }
  },

  // Leave a department
  leaveDepartment: async (departmentId, userId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}api/departments/${departmentId}/leave/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          withCredentials: true
        }
      );
       // Optimistically update the UI
    set((state) => ({
      userDepartments: state.userDepartments.filter(dept => dept._id !== departmentId),
      departments: state.departments.map(dept => 
        dept._id === departmentId 
          ? { 
              ...dept, 
              members: dept.members.filter(member => member._id !== userId) 
            }
          : dept
      ),
      loading: false
    }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      throw error;
    }
  }
}));

export default useDepartmentStore;