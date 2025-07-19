import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/Auth.jsx';
import Layout from './components/Layout';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import Notifications from './pages/Notifications';
import Announcements from './pages/Announcements';
import PrayerRequests from './pages/PrayerRequests';
import Votes from './pages/Votes';
import Birthdays from './pages/Birthdays';
import Departments from './pages/Departments';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthStore } from './contexts/AuthContext.js';
import useDepartmentStore from './contexts/departmentStore.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  //  const { user } = useAuthStore();
  // const initStore = useDepartmentStore(state => state.init);

  // useEffect(() => {
  //   const cleanup = initStore(user);
  //   return () => {
  //     cleanup(); // Cleanup listeners on unmount
  //   };
  // }, [user, initStore]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="prayers" element={<PrayerRequests />} />
                <Route path="votes" element={<Votes />} />
                <Route path="birthdays" element={<Birthdays />} />
                <Route path="departments" element={<Departments />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;