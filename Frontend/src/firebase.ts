import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

// Retrieve configuration from environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Validate configuration
const isConfigValid = 
  apiKey && 
  apiKey !== "your-api-key" &&
  projectId && 
  projectId !== "your-project-id";

let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let db: any = null;
let storage: any = null;

if (isConfigValid) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };

    app = initializeApp(firebaseConfig);
    console.log("Firebase Connected");

    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase failed to initialize:", error);
  }
} else {
  console.warn(
    "Firebase configuration is missing or incomplete in .env. Firebase features (Auth, Firestore, etc.) will be disabled."
  );
}

export { app, auth, googleProvider, db, storage };
export default app;