import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../Firebase';
import { useLocalStorage } from './useLocalStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //set user, ma byc przy renderowaniu raz

    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading(false);
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const login = async (data) => {
    console.log('useAUth')

    setUser(data);
    // navigate("/dashboard/profile", { replace: true });
    return auth.signInWithEmailAndPassword(data.email, data.password);
  };



  const signup = async (data) => {
    return auth.createUserWithEmailAndPassword(data.email, data.password);
  };


  function logout() {
    return auth.signOut();
  };


  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return user.updateEmail(email);
  }

  function updatePassword(password) {
    return user.updatePassword(password);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      resetPassword,
      updateEmail,
      updatePassword,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
