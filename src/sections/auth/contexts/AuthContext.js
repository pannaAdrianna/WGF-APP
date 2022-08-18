import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, auth_user } from '../../../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


const AuthContext = createContext();


export function useAuth() {

  return useContext(AuthContext);
}

export function AuthProvider({ children }) {

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    //set user, ma byc przy renderowaniu raz

    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading(false);
      setUser(user);
    });
    return unsubscribe;
  }, []);


  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {

    return auth.signInWithEmailAndPassword(email, password);

  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return user.updateEmail(email);
  }

  function updatePassword(password) {
    return user.updatePassword(password);
  }


  const values = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };


  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}
