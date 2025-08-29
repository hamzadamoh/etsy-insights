import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNdOA7miLm6iJWilN-COX8EWSsynElEok",
  authDomain: "etsy-6a694.firebaseapp.com",
  projectId: "etsy-6a694",
  storageBucket: "etsy-6a694.appspot.com",
  messagingSenderId: "120161962221",
  appId: "1:120161962221:web:b734fbdc0b530bf5554e4e4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
