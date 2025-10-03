import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';
import { User, UserRole } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isApproved: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or update user profile in Firestore
  const createUserProfile = async (user: FirebaseUser, additionalData: Partial<User> = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const userData: User = {
        uid: user.uid,
        email: email || '',
        displayName: displayName || '',
        photoURL: photoURL || undefined,
        role: 'student', // Default role
        isApproved: true, // Students are auto-approved
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        ...additionalData,
      };

      // If user selected organizer role, they need approval
      if (additionalData.role === 'organizer') {
        userData.isApproved = false;
      }

      await setDoc(userRef, userData);
      return userData;
    } else {
      // Update existing user with any new data
      if (Object.keys(additionalData).length > 0) {
        await updateDoc(userRef, {
          ...additionalData,
          updatedAt: Timestamp.now(),
        });
      }
      return userSnap.data() as User;
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const profile = userSnap.data() as User;
        setUserProfile(profile);
        return profile;
      } else {
        // Create profile if it doesn't exist
        const profile = await createUserProfile(user);
        setUserProfile(profile);
        return profile;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load user profile');
      return null;
    }
  };

  // Sign up with email and password
  const signup = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName,
        });
      }

      // Create Firestore profile
      await createUserProfile(user, userData);
      
      toast.success('Account created successfully!');
      
      if (userData.role === 'organizer') {
        toast.info('Your organizer account is pending approval.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to log in');
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await createUserProfile(user);
      toast.success('Logged in with Google successfully!');
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Failed to log in with Google');
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser || !userProfile) {
      throw new Error('No user logged in');
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(userRef, updateData);
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updateData } : null);
      
      // Update Firebase Auth profile if display name changed
      if (data.displayName && data.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: data.displayName,
        });
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  // Check if user is approved (for organizers)
  const isApproved: boolean = userProfile?.isApproved || false;

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    hasRole,
    isApproved,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};