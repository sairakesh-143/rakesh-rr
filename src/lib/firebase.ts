
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6FrNuqeBrfrwhZnulwDp4lC3lgt6hzck",
  authDomain: "hospital-149b6.firebaseapp.com",
  projectId: "hospital-149b6",
  storageBucket: "hospital-149b6.firebasestorage.app",
  messagingSenderId: "822650817761",
  appId: "1:822650817761:web:adc3079d5e1e249d033ba0",
  measurementId: "G-BN0WEFRPZC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
