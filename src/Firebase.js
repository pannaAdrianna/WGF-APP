// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNxruiZdBvfq3X_FO9oNEijAq_XEu_wHw",
  authDomain: "moje-eeg.firebaseapp.com",
  projectId: "moje-eeg",
  storageBucket: "moje-eeg.appspot.com",
  messagingSenderId: "1080822797000",
  appId: "1:1080822797000:web:caa94fceb1bd6ea35acbfd",
  measurementId: "G-4PD1NHNWJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
