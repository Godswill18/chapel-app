import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigation from './SideNavigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SideNavigation />
      <main className="lg:ml-64 lg:pt-0 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;