import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// NOTE: Cache clearing by version number has been PERMANENTLY REMOVED.
// Products, orders, and all data are stored in Firestore (cloud).
// localStorage is only used as a fast display cache — it NEVER controls what's real.
// Your uploaded products are ALWAYS safe in Firestore regardless of code changes.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
