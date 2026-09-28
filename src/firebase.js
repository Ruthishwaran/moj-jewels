// Firebase configuration for MOJ Jewels
// Project: moj-jewels-58b8c
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmvlo-MYNMdHzdNquGFdUfZpG6aIcJkyB",
  authDomain: "moj-jewels-58b8c.firebaseapp.com",
  projectId: "moj-jewels-58b8c",
  storageBucket: "moj-jewels-58b8c.firebasestorage.app",
  messagingSenderId: "100116097620",
  appId: "1:100116097620:web:a665dd0eadcd855f915bc1",
  measurementId: "G-2Y7MHK9SBY"
};

// Single app instance guard
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let db;
try {
  // persistentLocalCache: caches ALL Firestore data on device disk (IndexedDB).
  // After first visit, every load is INSTANT from local cache — even offline!
  // persistentSingleTabManager: compatible with ALL mobile browsers (iOS Safari,
  // Android Chrome, in-app WebViews) — does NOT require Web Locks API.
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager({ forceOwnership: true })
    })
  });
} catch (e) {
  // Fallback for environments where persistentLocalCache is unavailable
  try { db = getFirestore(app); } catch (e2) { db = getFirestore(); }
}

export { db };
