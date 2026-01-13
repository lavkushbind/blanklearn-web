import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// 🔹 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkAbUlYv7SeA08-JFxFbkHaF_tlpbRIMw",
  authDomain: "dark-6191f.firebaseapp.com",
  databaseURL: "https://dark-6191f-default-rtdb.firebaseio.com",
  projectId: "dark-6191f",
  storageBucket: "dark-6191f.appspot.com",
  messagingSenderId: "730022278030",
  appId: "1:730022278030:web:e5a2754692f94dc073aadf",
};

// 🔹 Prevent multiple Firebase initialization (Next.js safe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔹 Single source of truth
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Ye line add kar dein (Language fix ke liye)

export const realtimeDb = getDatabase(app);

export default app;
