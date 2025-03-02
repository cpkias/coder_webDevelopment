import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDTRCyveZ2i3pZCy3EhCpkCDnIW0rSiyz8",
  authDomain: "user-profile-project-919aa.firebaseapp.com",
  projectId: "user-profile-project-919aa",
  storageBucket: "user-profile-project-919aa.firebasestorage.app",
  messagingSenderId: "724839725506",
  appId: "1:724839725506:web:8c145f720561741845be5b",
  measurementId: "G-6N4EM5WWF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };