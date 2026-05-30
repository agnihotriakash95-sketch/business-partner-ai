import { Navigate, Outlet } from 'react-router-dom';
import { firebaseReady } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';

export const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { loading, profile, firebaseUser, isDemo } = useAuth();
  if (loading) return <LoadingScreen />;
  if (firebaseReady && !firebaseUser && !isDemo) return <Navigate to="/login" replace />;
  if (adminOnly && profile.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
