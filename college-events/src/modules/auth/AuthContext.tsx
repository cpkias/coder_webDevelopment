import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, firestore } from '@/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type AppRole = 'student' | 'organizer' | 'admin';

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: AppRole;
  approvedOrganizer?: boolean;
};

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapFirebaseUserToAppUser(firebaseUser: User, roleDoc?: any): AppUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    role: (roleDoc?.role as AppRole) ?? 'student',
    approvedOrganizer: roleDoc?.approvedOrganizer ?? false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const roleSnap = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      setUser(mapFirebaseUserToAppUser(firebaseUser, roleSnap.data()));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(firestore, 'users', res.user.uid), {
      role: 'student',
      createdAt: new Date(),
      approvedOrganizer: false,
      email,
    });
  };

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const userRef = doc(firestore, 'users', res.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        role: 'student',
        createdAt: new Date(),
        approvedOrganizer: false,
        email: res.user.email,
      });
    }
  };

  const signOutUser = async () => { await signOut(auth); };

  const value = useMemo(() => ({ user, loading, signInEmail, signUpEmail, signInGoogle, signOutUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
