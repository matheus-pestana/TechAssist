import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwz_j-U4zOKQh0Fa7BSoXOseYXABeJqdU",
  authDomain: "techassist-b7b52.firebaseapp.com",
  projectId: "techassist-b7b52",
  storageBucket: "techassist-b7b52.appspot.com",
  messagingSenderId: "297703080275",
  appId: "1:297703080275:web:0f0eda70ec264d52f621a6",
  measurementId: "G-2KM4K2JF02"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };