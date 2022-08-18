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
import { getStorage,ref } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
  apiKey: "AIzaSyDqyMvsxmmGXwT4TgOHRqvz7pS2EUGNzR4",
  authDomain: "wgf-app.firebaseapp.com",
  projectId: "wgf-app",
  storageBucket: "wgf-app.appspot.com",
  messagingSenderId: "325866270600",
  appId: "1:325866270600:web:82711657ee30fd01e3943d"

});
export default app;
const db = getFirestore(app);
const storage = getStorage(app);

export { storage, db};
export const auth = app.auth();
export const auth_user = getAuth();

export const checkErrorCode = (code) => {
  switch (code) {

    case 'auth/wrong-password':
      return 'Wrong Password';
    case 'auth/email-already-exists':
      return 'Account exists';
    case 'auth/user-not-found':
      return 'Account doesn\'t exists';
    case'auth/email-already-in-use':
      return 'Email already registered';


  }

};


export const registerWithEmailAndPassword = async (name, last_name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth_user, email, password);
    const user = res.user;

  } catch (err) {
    console.error('tutak', err);
    return err;
  }
};


export const logout = () => {
  signOut(auth_user).then(r => console.log('Wylogowano'));

};
