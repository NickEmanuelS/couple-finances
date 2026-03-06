// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFiEYpJbnIETc_4RTaELbfI5eXLv_BKck",
  authDomain: "couple-finances-40f69.firebaseapp.com",
  projectId: "couple-finances-40f69",
  storageBucket: "couple-finances-40f69.firebasestorage.app",
  messagingSenderId: "899091245575",
  appId: "1:899091245575:web:2bc12078f9f4f01074d8a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);