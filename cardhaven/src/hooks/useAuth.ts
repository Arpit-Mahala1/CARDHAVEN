import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';

import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u: User | null) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    if (!auth) return;
    try {
      setError(null);
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Signup failed';
      setError(msg);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) return;
    try {
      setError(null);
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) return;
    try {
      setError(null);
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google login failed';
      setError(msg);
      throw err;
    }
  };

  const loginAnonymously = async () => {
    if (!auth) return;
    try {
      setError(null);
      const { signInAnonymously } = await import('firebase/auth');
      await signInAnonymously(auth);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Anonymous login failed';
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return { user, loading, error, signup, login, loginWithGoogle, loginAnonymously, logout };
}
