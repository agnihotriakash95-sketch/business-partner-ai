import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, firebaseReady, googleProvider } from '../config/firebase';
import { missingFirebaseEnv } from '../config/firebaseConfig';
import { getAuthErrorMessage } from '../utils/authErrors';

const requireAuth = () => {
  if (!firebaseReady || !auth) {
    const missing = missingFirebaseEnv.length ? ` Missing: ${missingFirebaseEnv.join(', ')}.` : '';
    throw new Error(`Firebase config missing. Add your VITE Firebase values to .env.${missing}`);
  }
  return auth;
};

export const canUseFirebaseAuth = () => Boolean(firebaseReady && auth);

export const initializeAuthSession = async () => {
  if (!auth) return null;
  await setPersistence(auth, browserLocalPersistence);
  return getRedirectResult(auth);
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const firebaseAuth = requireAuth();
    await setPersistence(firebaseAuth, browserLocalPersistence);
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const signupWithEmail = async (email: string, password: string) => {
  try {
    const firebaseAuth = requireAuth();
    await setPersistence(firebaseAuth, browserLocalPersistence);
    return await createUserWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const loginWithGoogle = async () => {
  try {
    const firebaseAuth = requireAuth();
    await setPersistence(firebaseAuth, browserLocalPersistence);
    await signInWithPopup(firebaseAuth, googleProvider);
    return true;
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
    if (code === 'auth/popup-blocked') {
      await signInWithRedirect(requireAuth(), googleProvider);
      return false;
    }
    throw new Error(getAuthErrorMessage(error));
  }
};

export const resetPassword = async (email: string) => {
  try {
    return await sendPasswordResetEmail(requireAuth(), email);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};
export const logout = () => (auth ? signOut(auth) : Promise.resolve());

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, callback);
};
