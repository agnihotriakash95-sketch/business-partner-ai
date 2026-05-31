import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { canUseFirebaseAuth, initializeAuthSession, loginWithEmail, loginWithGoogle, logout, resetPassword, signupWithEmail, subscribeToAuth } from '../services/authService';
import { saveUserProfile } from '../services/firestoreService';
import type { UserProfile } from '../types';
import { getAuthErrorMessage } from '../utils/authErrors';

const SESSION_KEY = 'business-partner-session';

interface AuthContextValue {
  firebaseUser: User | null;
  profile: UserProfile;
  loading: boolean;
  authNotice: string;
  authError: string;
  clearAuthMessages: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  googleLogin: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadLocalProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
};

const saveLocalProfile = (profile: UserProfile) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(() => loadLocalProfile());
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
            name: firebaseUser.displayName || localProfile?.name || 'Business Owner',
            title: localProfile?.title || 'Founder & CEO',
            email: firebaseUser.email || '',
            role: 'admin',
            plan: localProfile?.plan || 'pro',
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          }
        : localProfile || {
            id: 'guest',
            name: 'Guest',
            title: 'Sign in required',
            email: '',
            role: 'user',
            plan: 'free',
            createdAt: new Date().toISOString(),
          },
    [firebaseUser, localProfile]
  );

  useEffect(() => {
    if (firebaseUser) void saveUserProfile(profile);
  }, [firebaseUser, profile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading,
      authNotice,
      authError,
      clearAuthMessages: () => {
        setAuthNotice('');
        setAuthError('');
      },
      login: async (email, password) => {
        if (firebaseAuthReady) {
          await loginWithEmail(email, password);
          setAuthNotice('Login successful.');
          return;
        }
        if (!email || !password) throw new Error('Email and password are required.');
        const session: UserProfile = {
          id: crypto.randomUUID(),
          name: email.split('@')[0],
          title: 'Founder & CEO',
          email,
          role: 'admin',
          plan: 'pro',
          createdAt: new Date().toISOString(),
        };
        saveLocalProfile(session);
        setLocalProfile(session);
        setAuthNotice('Session started.');
      },
      signup: async (email, password, name) => {
        if (firebaseAuthReady) {
          await signupWithEmail(email, password);
          setAuthNotice('Account created successfully.');
          return;
        }
        if (!email || password.length < 8) throw new Error('Use a valid email and at least 8 characters.');
        const session: UserProfile = {
          id: crypto.randomUUID(),
          name: name || email.split('@')[0],
          title: 'Founder & CEO',
          email,
          role: 'admin',
          plan: 'pro',
          createdAt: new Date().toISOString(),
        };
        saveLocalProfile(session);
        setLocalProfile(session);
        setAuthNotice('Account created.');
      },
      googleLogin: async () => {
        if (!firebaseAuthReady) throw new Error('Configure Firebase for Google sign-in.');
        const signedIn = await loginWithGoogle();
        if (signedIn) setAuthNotice('Google sign-in successful.');
        return signedIn;
      },
      forgotPassword: async (email) => {
        if (!firebaseAuthReady) throw new Error('Configure Firebase for password reset.');
        if (!email) throw new Error('Enter your email address.');
        await resetPassword(email);
        setAuthNotice('Password reset email sent.');
      },
      signOutUser: async () => {
        localStorage.removeItem(SESSION_KEY);
        setLocalProfile(null);
        await logout();
      },
    }),
    [authError, authNotice, firebaseAuthReady, firebaseUser, loading, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

export const hasActiveSession = (): boolean => {
  return Boolean(loadLocalProfile());
};
