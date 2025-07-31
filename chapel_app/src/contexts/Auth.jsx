import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useUserContext } from './AuthContext';
import { useAuthStore } from './AuthContext';

const AuthContext = createContext();

export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { getUser } = useUserContext();
  const { user, login, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useLayoutEffect(() => {
    const restoreSession = async () => {
      if (initialized) return;
      try {
        setLoading(true);
        // Prioritize sessionStorage, fall back to localStorage
        const token = sessionStorage.getItem('token') 
        // || localStorage.getItem('token');
        if (!token) {
          logout();
          sessionStorage.removeItem('token');
          // localStorage.removeItem('token');
          return;
        }
        const userData = await getUser();
        if (userData && userData._id) {
          login(userData, token);
        } else {
          logout();
          sessionStorage.removeItem('token');
          // localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        logout();
        sessionStorage.removeItem('token');
        // localStorage.removeItem('token');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    restoreSession();
  }, [getUser, login, logout, initialized]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};