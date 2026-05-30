import type { FirebaseError } from 'firebase/app';

const isFirebaseError = (error: unknown): error is FirebaseError =>
  typeof error === 'object' && error !== null && 'code' in error;

export const getAuthErrorMessage = (error: unknown) => {
  if (!isFirebaseError(error)) {
    return error instanceof Error ? error.message : 'Authentication failed. Please try again.';
  }

  switch (error.code) {
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Allow popups for this site or use the redirect sign-in fallback.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was closed before completion.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Auth. Add your localhost or production domain in Firebase Console > Authentication > Settings.';
    case 'auth/network-request-failed':
      return 'Network issue while connecting to Firebase. Check your internet connection and try again.';
    case 'auth/invalid-api-key':
    case 'auth/app-not-authorized':
      return 'Firebase configuration is invalid. Check your VITE Firebase environment variables.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'This email already has an account. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};
