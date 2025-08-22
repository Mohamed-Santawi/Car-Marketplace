// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXCW15HO228Ldc4SahGAGSd5UtNrL9VX0",
  authDomain: "readura-app-112fa.firebaseapp.com",
  projectId: "readura-app-112fa",
  storageBucket: "readura-app-112fa.firebasestorage.app",
  messagingSenderId: "260307617156",
  appId: "1:260307617156:web:1481fddae58434d0d609d1",
  measurementId: "G-CB3Q2J3WNZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Debug Firebase initialization
console.log("Firebase app initialized:", app);
console.log("Firestore instance:", db);
console.log("Firebase config:", firebaseConfig);

// Helper function to get complete Firestore rules
export const getCompleteFirestoreRules = () => {
  return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to carAdvertisements collection
    match /carAdvertisements/{document} {
      allow read, write: if true; // Allow all operations
    }

    // Allow read/write access to test collection
    match /test/{document} {
      allow read, write: if true;
    }

    // Allow read/write access to users collection
    match /users/{document} {
      allow read, write: if true;
    }

    // Allow read/write access to admins collection
    match /admins/{document} {
      allow read, write: if true;
    }

    // Allow read/write access to orders collection
    match /orders/{document} {
      allow read, write: if true;
    }

    // Allow read/write access to customers collection
    match /customers/{document} {
      allow read, write: if true;
    }

    // Allow read/write access to analytics collection
    match /analytics/{document} {
      allow read, write: if true;
    }

    // Allow read/write access to paymentOrders collection
    match /paymentOrders/{document} {
      allow read, write: if true;
    }

    // Allow read/write access to promotionPackages collection
    match /promotionPackages/{document} {
      allow read, write: if true;
    }

    // Default rule - deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;
};

export default app;
