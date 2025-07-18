import { create } from 'zustand';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

export const useUserStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  // Get logged-in user profile
  fetchUserProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        set({ profile: data, loading: false });
        return data;
      }
      throw new Error(data.message || 'Failed to fetch profile');
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Update user profile
  updateUserProfile: async (updatedData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      if (res.ok) {
        set({ profile: data, loading: false });
        return data;
      }
      throw new Error(data.message || 'Failed to update profile');
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/users/uploadProfileImg`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        set(state => ({
          profile: {
            ...state.profile,
            profileImg: data.profileImg
          },
          loading: false
        }));
        return data;
      }
      throw new Error(data.message || 'Failed to upload image');
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Change password
  changePassword: async ({ currentPassword, newPassword }) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        set({ loading: false });
        return data;
      }
      throw new Error(data.message || 'Failed to change password');
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));