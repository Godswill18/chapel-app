import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from './AuthContext'; // adjust path to where your zustand store is
import { useAuthStore } from './AuthContext'; // same here

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { getUser } = useUserContext();
  const { user, login, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
  const restoreSession = async () => {
    if (initialized) return; // Prevent multiple runs
    try {
      setLoading(true);
      const userData = await getUser();
      if (userData && userData._id) {
        login(userData, localStorage.getItem('token'));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Session restoration failed:', err);
      logout();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  restoreSession();
}, [getUser, login, logout, initialized]);

  // useEffect(() => {
  //   if (initialized) return;

  //   const restoreSession = async () => {
  //     try {
  //       setLoading(true);
  //       const userData = await getUser();
  //       if (userData && userData._id) {
  //         login(userData, localStorage.getItem('token'))
  //       } else {
  //         logout();
  //       }
  //     } catch (err) {
  //       console.error("Session restoration failed", err);
  //       logout();
  //     } finally {
  //       setLoading(false);
  //       setInitialized(true);
  //     }
  //   };

  //   restoreSession();
  // }, [initialized]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login, // from zustand
        logout, // from zustand
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
