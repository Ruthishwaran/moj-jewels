// Firebase configuration for MOJ Jewels
// Project: moj-jewels-58b8c
import { initializeApp } from 'firebase/app';
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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
