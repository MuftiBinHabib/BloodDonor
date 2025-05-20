// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB2votxKLrCnMUCymiEuDHn_2e7mzTH6iY",
  authDomain: "blooddonor-9213e.firebaseapp.com",
  databaseURL: "https://blooddonor-9213e-default-rtdb.firebaseio.com", // Important!
  projectId: "blooddonor-9213e",
  storageBucket: "blooddonor-9213e.appspot.com",
  messagingSenderId: "192147208429",
  appId: "1:192147208429:web:b87a15a67c74c04b5474e4"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export the initialized database
export const db = getDatabase(app);
