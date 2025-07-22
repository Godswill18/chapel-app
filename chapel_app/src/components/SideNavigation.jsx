import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Bell, Megaphone, Heart, Vote, Moon, Sun, Menu, X,
  LogOut, Church, Calendar, Gift, Users, User, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthStore, useUserContext } from '../contexts/AuthContext';

const SideNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, login: loginToAuthStore } = useAuthStore();
  const { getUser, logoutUser } = useUserContext();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await getUser();
        if (!userData?._id) {
          navigate('/login');
          return;
        }
        loginToAuthStore(userData, localStorage.getItem('token'));
      } catch {
        navigate('/login');
      }
    };

    verifyUser();
  }, [getUser, loginToAuthStore, navigate]);

  const handleLogout = async () => {
    const response = await logoutUser();
    if (response.success) {
      navigate('/login');
    } else {
      console.error('Logout failed:', response.message);
    }
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
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Church className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WSU Chapel
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              {theme === 'light' ? <Moon /> : <Sun />}
            </button>
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              {isMobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 overflow-y-auto ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Church className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WSU Chapel
              </span>
            </Link>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                location.pathname === path
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title={isCollapsed ? label : undefined}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {!isCollapsed && user && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || ''}
                </div>
                <div>
                  <div className="font-medium">{user.firstName}</div>
                  <div className="text-sm text-gray-500">{user.position}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button onClick={toggleTheme} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'light' ? <Moon /> : <Sun />}
              {!isCollapsed && <span className="ml-2">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
              <LogOut />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNavigation;
