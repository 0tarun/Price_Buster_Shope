import { useCallback, useMemo, useState } from 'react';
import { login as authenticate } from '../services/api';
import { AuthContext } from './auth-context';
const STORAGE_KEY = 'price-buster-user';

function readStoredUser() {
  try {
    const savedUser = window.localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Unable to read the saved account session:', error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const signIn = useCallback(async (email, password) => {
    const response = await authenticate(email, password);
    const authenticatedUser = response.user || response;
    setUser(authenticatedUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), signIn, signOut, updateUser }),
    [user, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
