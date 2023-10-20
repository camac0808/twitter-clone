import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyDVW8JPY-SYp7OEwn4pKg-LIvetwJWNT7Y",
  authDomain: "twitter-firebase-674a8.firebaseapp.com",
  projectId: "twitter-firebase-674a8",
  storageBucket: "twitter-firebase-674a8.appspot.com",
  messagingSenderId: "1019510125258",
  appId: "1:1019510125258:web:429440afba5c750ea9ba33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app); 