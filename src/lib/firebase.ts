// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDkAbUlYv7SeA08-JFxFbkHaF_tlpbRIMw",
  authDomain: "dark-6191f.firebaseapp.com",
  databaseURL: "https://dark-6191f-default-rtdb.firebaseio.com",
  projectId: "dark-6191f",
  storageBucket: "dark-6191f.appspot.com",
  messagingSenderId: "730022278030",
  appId: "1:730022278030:web:e5a2754692f94dc073aadf",
};

// App Initialize logic: Prevents re-initialization on every request/reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth Export
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Database Export 
export const realtimeDb = getDatabase(app);

// Export RecaptchaVerifier explicitly, as it relies on browser APIs
export { RecaptchaVerifier }; 

// IMPORTANT: Removed 'export default app;' to prevent SSR build errors in other modules.