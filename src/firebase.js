// Firebase configuration for MOJ Jewels
// Project: moj-jewels-58b8c
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

// Standard getFirestore: 100% universal across all browsers, mobile devices,
// incognito/private modes, and multiple simultaneous open tabs without lock contention.
export const db = getFirestore(app);
