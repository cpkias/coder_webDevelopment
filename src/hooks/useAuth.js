/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logout as authLogout,
  resetPassword,
} from '@/services/authService';

export const useAuth = () => {
  const { user, userProfile, loading, error, initializeAuth, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  const register = async (email, password, displayName, role) => {
    try {
      return await registerWithEmail(email, password, displayName, role);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmail(email, password);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      return await signInWithGoogle();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      storeLogout();
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = userProfile?.role === 'admin';
  const isOrganizer = userProfile?.role === 'organizer' || isAdmin;
  const isStudent = userProfile?.role === 'student';

  return {
    user,
    userProfile,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    isAuthenticated,
    isAdmin,
    isOrganizer,
    isStudent,
  };
};
