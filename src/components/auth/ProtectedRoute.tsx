import { Navigate, Outlet } from 'react-router-dom';
import { firebaseReady } from '../../config/firebase';
import { hasActiveSession, useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';

export const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { loading, profile, firebaseUser } = useAuth();
  if (loading) return <LoadingScreen />;
  const authenticated = Boolean(firebaseUser) || hasActiveSession() || profile.id !== 'guest';
  if (firebaseReady && !authenticated) return <Navigate to="/login" replace />;
  if (!firebaseReady && !authenticated && profile.id === 'guest') return <Navigate to="/login" replace />;
  if (adminOnly && profile.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
