/**
 * Authentication Service
 * Handles user authentication, registration, and role management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/config/firebase';

/**
 * User roles enum
 */
export const UserRoles = {
  STUDENT: 'student',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
};

/**
 * Create user profile in Firestore
 */
const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Register user with email and password
 */
export const registerWithEmail = async (email, password, displayName, role = UserRoles.STUDENT) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Send email verification
    await sendEmailVerification(user);

    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      uid: user.uid,
      email: user.email,
      displayName,
      role,
      isApproved: role === UserRoles.STUDENT, // Students auto-approved, organizers need approval
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
    });

    return { user, requiresApproval: role === UserRoles.ORGANIZER };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is approved
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    if (!userData.isApproved) {
      await signOut(auth);
      throw new Error('Your account is pending approval. Please wait for admin approval.');
    }

    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user profile
      await createUserProfile(user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: UserRoles.STUDENT,
        isApproved: true,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      });
    } else {
      // Check if user is approved
      const userData = userDoc.data();
      if (!userData.isApproved) {
        await signOut(auth);
        throw new Error('Your account is pending approval.');
      }
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (userRole, requiredRole) => {
  const roleHierarchy = {
    [UserRoles.ADMIN]: 3,
    [UserRoles.ORGANIZER]: 2,
    [UserRoles.STUDENT]: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
