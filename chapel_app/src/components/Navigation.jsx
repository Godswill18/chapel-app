import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Bell, 
  Megaphone, 
  Heart, 
  Vote, 
  Moon, 
  Sun, 
  Menu, 
  X,
  LogOut,
  Church,
  Calendar,
  Gift,
  Users
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navigation= () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/prayers', label: 'Prayer Requests', icon: Heart },
    { path: '/votes', label: 'Votes', icon: Vote },
    { path: '/birthdays', label: 'Birthdays', icon: Gift },
    { path: '/departments', label: 'Departments', icon: Users },
  ];

//  if (!isAuthenticated) {

//     return <Navigate to="/login" replace />;
//   }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Church className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chapel App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-white">{user?.name}</div>
                <div className="text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                    
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">{user?.name}</div>
                  <div className="text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;