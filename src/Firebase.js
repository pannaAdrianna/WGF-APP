import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
  apiKey: 'AIzaSyBNxruiZdBvfq3X_FO9oNEijAq_XEu_wHw',
  authDomain: 'moje-eeg.firebaseapp.com',
  projectId: 'moje-eeg',
  storageBucket: 'moje-eeg.appspot.com',
  messagingSenderId: '1080822797000',
  appId: '1:1080822797000:web:caa94fceb1bd6ea35acbfd',
  measurementId: 'G-4PD1NHNWJZ',

});
export default app;
const db = getFirestore();
const storage = app.storage();
export { storage, db };
export const auth = app.auth();
export const auth_user = getAuth();

export const  checkErrorCode =(code)=>{
  switch (code) {

    case 'auth/wrong-password':
      return 'Wrong Password';
    case 'auth/email-already-exists':
      return "Account exists"
    case 'auth/user-not-found':
      return "Account doesn't exists"
    case'auth/email-already-in-use':
      return "Email already registered"


  }

}




export const registerWithEmailAndPassword = async (name, last_name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth_user, email, password);
    const user = res.user;

  } catch (err) {
    console.error('tutak', err);
    return err
  }
};


export const logout = () => {
  signOut(auth_user).then(r => console.log('Wylogowano'));

};
