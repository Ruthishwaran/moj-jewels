import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Version-based cache busting - any version mismatch clears ALL stored data
const APP_VERSION = '2.0';
const storedVersion = localStorage.getItem('moj_app_version');

if (storedVersion !== APP_VERSION) {
  // Clear all old MOJ data
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('moj_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  localStorage.setItem('moj_app_version', APP_VERSION);
  console.log('[MOJ Jewels] Cache cleared for version', APP_VERSION);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
