import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as authenticate, logout as endSession, registerAccount } from '../services/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    window.localStorage.removeItem('price-buster-user');

    getCurrentUser()
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser);
      })
      .catch((error) => {
        if (error.status !== 401) {
          console.error('Unable to restore the account session:', error);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  const signIn = useCallback(async (email, password, rememberMe) => {
    const { user: authenticatedUser } = await authenticate(email, password, rememberMe);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    const { user: authenticatedUser } = await registerAccount({ name, email, password });
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const signOut = useCallback(async () => {
    await endSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isLoading, signIn, signUp, signOut, updateUser }),
    [user, isLoading, signIn, signUp, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
