// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Ye line nayi hai

const firebaseConfig = {
  apiKey: "AIzaSyDkAbUlYv7SeA08-JFxFbkHaF_tlpbRIMw",
  authDomain: "dark-6191f.firebaseapp.com",
  databaseURL: "https://dark-6191f-default-rtdb.firebaseio.com", // Ye zaroori hai
  projectId: "dark-6191f",
  storageBucket: "dark-6191f.appspot.com",
  messagingSenderId: "730022278030",
  appId: "1:730022278030:web:e5a2754692f94dc073aadf",
  measurementId: "G-BE3WDDVM30"
};

const app = initializeApp(firebaseConfig);

// Hum 'realtimeDb' export kar rahe hain kyunki aapka data wahan hai
export const realtimeDb = getDatabase(app);