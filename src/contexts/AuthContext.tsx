import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoUser } from '../data/demoData';
import { canUseFirebaseAuth, initializeAuthSession, loginWithEmail, loginWithGoogle, logout, resetPassword, signupWithEmail, subscribeToAuth } from '../services/authService';
import { saveUserProfile } from '../services/firestoreService';
import type { UserProfile } from '../types';
import { getAuthErrorMessage } from '../utils/authErrors';

interface AuthContextValue {
  firebaseUser: User | null;
  profile: UserProfile;
  loading: boolean;
  isDemo: boolean;
  authNotice: string;
  authError: string;
  clearAuthMessages: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [, setDemoAuthenticated] = useState(() => localStorage.getItem('business-partner-demo-auth') === 'true');
  const [loading, setLoading] = useState(true);
  const [authNotice, setAuthNotice] = useState('');
  const [authError, setAuthError] = useState('');
  const firebaseAuthReady = canUseFirebaseAuth();

  useEffect(() => {
    if (!firebaseAuthReady) {
      setLoading(false);
      return () => undefined;
    }

    initializeAuthSession()
      .then((result) => {
        if (result?.user) setAuthNotice('Google sign-in successful. Welcome back.');
      })
      .catch((error) => setAuthError(getAuthErrorMessage(error)));

    const unsubscribe = subscribeToAuth((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseAuthReady]);

  const profile: UserProfile = useMemo(
    () =>
      firebaseUser
        ? {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || demoUser.name,
            title: demoUser.title,
            email: firebaseUser.email || demoUser.email,
            role: 'admin',
            plan: 'pro',
            createdAt: firebaseUser.metadata.creationTime || demoUser.createdAt,
          }
        : demoUser,
    [firebaseUser],
  );

  useEffect(() => {
    if (firebaseUser) void saveUserProfile(profile);
  }, [firebaseUser, profile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading,
      isDemo: !firebaseUser && !firebaseAuthReady,
      authNotice,
      authError,
      clearAuthMessages: () => {
        setAuthNotice('');
        setAuthError('');
      },
      login: async (email, password) => {
        if (firebaseAuthReady) {
          await loginWithEmail(email, password);
          setAuthNotice('Login successful. Session is saved on this device.');
          return;
        }
        if (!email || !password) throw new Error('Email and password are required.');
        localStorage.setItem('business-partner-demo-auth', 'true');
        setDemoAuthenticated(true);
        setAuthNotice('Demo login successful. Add Firebase .env values to enable real authentication.');
      },
      signup: async (email, password) => {
        if (firebaseAuthReady) {
          await signupWithEmail(email, password);
          setAuthNotice('Account created successfully.');
          return;
        }
        if (!email || password.length < 8) throw new Error('Use a valid email and at least 8 characters for password.');
        localStorage.setItem('business-partner-demo-auth', 'true');
        setDemoAuthenticated(true);
        setAuthNotice('Demo account created. Add Firebase .env values to enable real authentication.');
      },
      googleLogin: async () => {
        if (!firebaseAuthReady) {
          localStorage.setItem('business-partner-demo-auth', 'true');
          setDemoAuthenticated(true);
          setAuthNotice('Demo Google sign-in enabled. Configure Firebase to connect real Google Auth.');
          return true;
        }
        const signedIn = await loginWithGoogle();
        if (signedIn) setAuthNotice('Google sign-in successful. Session is saved on this device.');
        return signedIn;
      },
      forgotPassword: async (email) => {
        if (firebaseAuthReady) {
          await resetPassword(email);
          return;
        }
        if (!email) throw new Error('Enter your email address.');
        setAuthNotice('Demo mode: password reset email is simulated.');
      },
      signOutUser: async () => {
        localStorage.removeItem('business-partner-demo-auth');
        setDemoAuthenticated(false);
        await logout();
      },
    }),
    [authError, authNotice, firebaseAuthReady, firebaseUser, loading, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
