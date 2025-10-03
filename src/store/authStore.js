/**
 * Authentication Store
 * Global state management for authentication using Zustand
 */

import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { getUserProfile } from '@/services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Initialize auth listener
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          set({ user, userProfile: profile, loading: false, error: null });
        } catch (error) {
          set({ user: null, userProfile: null, loading: false, error: error.message });
        }
      } else {
        set({ user: null, userProfile: null, loading: false, error: null });
      }
    });

    return unsubscribe;
  },

  logout: () => {
    set({ user: null, userProfile: null, loading: false, error: null });
  },
}));
