import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore if needed
import { getAuth } from "firebase/auth"; // Import Auth if needed

const firebaseConfig = {
  apiKey: "AIzaSyCCMKLhraJbnLg2YpxrqAasEZbPtwnYX5o",
  authDomain: "personal-finance-mngment.firebaseapp.com",
  projectId: "personal-finance-mngment",
  storageBucket: "personal-finance-mngment.appspot.com",
  messagingSenderId: "570957534925",
  appId: "1:570957534925:web:dbb982328cf9e227a6fb84",
  measurementId: "G-HNDZS9JCRS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
