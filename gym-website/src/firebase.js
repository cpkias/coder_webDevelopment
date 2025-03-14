// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCePMepX5cRJgk8ufUKUesJ1LC0SnjlCyg",
  authDomain: "gym-web-4d339.firebaseapp.com",
  projectId: "gym-web-4d339",
  storageBucket: "gym-web-4d339.firebasestorage.app",
  messagingSenderId: "880940204092",
  appId: "1:880940204092:web:246b1c916757cf940ec339",
  measurementId: "G-9EW21K1N6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);