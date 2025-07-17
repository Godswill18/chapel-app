import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure proper theme initialization before React renders
const initializeTheme = () => {
  const saved = localStorage.getItem('chapel-theme');
  const root = document.documentElement;
  
  if (saved === 'dark') {
    root.classList.add('dark');
  } else if (saved === 'light') {
    root.classList.remove('dark');
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
      localStorage.setItem('chapel-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('chapel-theme', 'light');
    }
  }
};

// Initialize theme immediately
initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
