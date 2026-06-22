'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { deregisterFcmToken, getCurrentUser, logoutDevice } from '@/lib/api';
import type { UserProfile } from '@/lib/api';
import {
  clearStoredFirebaseMessagingToken,
  getStoredFirebaseMessagingToken,
  setFcmEnabledPreference,
} from '@/lib/firebaseMessaging';

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  firebaseUser: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          const profile = await getCurrentUser(token);
          setUser(profile);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refreshUser = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    try {
      const token = await fbUser.getIdToken(true);
      const profile = await getCurrentUser(token);
      setUser(profile);
    } catch {}
  };

  const logout = async () => {
    const fbUser = auth.currentUser;
    if (fbUser) {
      try {
        const token = await fbUser.getIdToken();
        const fcmToken = getStoredFirebaseMessagingToken();
        if (fcmToken) {
          await deregisterFcmToken(token, fcmToken).catch(() => {});
          clearStoredFirebaseMessagingToken();
        }
        setFcmEnabledPreference(false);
        await logoutDevice(token);
      } catch {}
    }
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
