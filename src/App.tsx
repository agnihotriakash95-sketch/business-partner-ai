import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { AuthLayout } from './pages/auth/AuthLayout';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { LandingPage } from './pages/landing/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AdminPage = lazy(() => import('./pages/dashboard/AdminPage').then((module) => ({ default: module.AdminPage })));
const AIChatPage = lazy(() => import('./pages/dashboard/AIChatPage').then((module) => ({ default: module.AIChatPage })));
const AnalyzerPage = lazy(() => import('./pages/dashboard/AnalyzerPage').then((module) => ({ default: module.AnalyzerPage })));
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const CollectionsPage = lazy(() => import('./pages/dashboard/CollectionsPage').then((module) => ({ default: module.CollectionsPage })));
const CustomersPage = lazy(() => import('./pages/dashboard/CustomersPage').then((module) => ({ default: module.CustomersPage })));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome').then((module) => ({ default: module.DashboardHome })));
const FinancePage = lazy(() => import('./pages/dashboard/FinancePage').then((module) => ({ default: module.FinancePage })));
const ImageGeneratorPage = lazy(() => import('./pages/dashboard/ImageGeneratorPage').then((module) => ({ default: module.ImageGeneratorPage })));
const MsmeReportsPage = lazy(() => import('./pages/dashboard/MsmeReportsPage').then((module) => ({ default: module.MsmeReportsPage })));
const PaymentFailedPage = lazy(() => import('./pages/dashboard/PaymentFailedPage').then((module) => ({ default: module.PaymentFailedPage })));
const PaymentSuccessPage = lazy(() => import('./pages/dashboard/PaymentSuccessPage').then((module) => ({ default: module.PaymentSuccessPage })));
const RecoveryPage = lazy(() => import('./pages/dashboard/RecoveryPage').then((module) => ({ default: module.RecoveryPage })));
const ReportsPage = lazy(() => import('./pages/dashboard/ReportsPage').then((module) => ({ default: module.ReportsPage })));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const SubscriptionPage = lazy(() => import('./pages/dashboard/SubscriptionPage').then((module) => ({ default: module.SubscriptionPage })));
const UploadScannerPage = lazy(() => import('./pages/dashboard/UploadScannerPage').then((module) => ({ default: module.UploadScannerPage })));
const VoiceAssistantPage = lazy(() => import('./pages/dashboard/VoiceAssistantPage').then((module) => ({ default: module.VoiceAssistantPage })));

export const App = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="chat" element={<AIChatPage />} />
          <Route path="voice" element={<VoiceAssistantPage />} />
          <Route path="images" element={<ImageGeneratorPage />} />
          <Route path="msme-reports" element={<MsmeReportsPage />} />
          <Route path="scanner" element={<UploadScannerPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="analyzer" element={<AnalyzerPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="recovery" element={<RecoveryPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-failed" element={<PaymentFailedPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);
