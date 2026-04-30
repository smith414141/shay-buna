import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBl1ERfBJWF5JYCQMvEphLHPFcHy2slCtU",
  authDomain: "shay-buna-4e59a.firebaseapp.com",
  projectId: "shay-buna-4e59a",
  storageBucket: "shay-buna-4e59a.firebasestorage.app",
  messagingSenderId: "879415691861",
  appId: "1:879415691861:web:0531b2bb12c2c04f7162dc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
