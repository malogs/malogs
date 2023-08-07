// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlZL--D6OiyshYeDJlbbmmZp18GDMb1PI",
  authDomain: "redjanvier-1c195.firebaseapp.com",
  projectId: "redjanvier-1c195",
  storageBucket: "redjanvier-1c195.appspot.com",
  messagingSenderId: "871830727515",
  appId: "1:871830727515:web:53be388c77609228f7487e",
  measurementId: "G-V58RFQV2XJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);