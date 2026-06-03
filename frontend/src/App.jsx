import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store';
import { fetchProfile } from './store/authSlice';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DesignGeneratorPage from './pages/ai/DesignGeneratorPage';
import ColorPalettePage from './pages/ai/ColorPalettePage';
import LogoGeneratorPage from './pages/ai/LogoGeneratorPage';
import BrandIdentityPage from './pages/ai/BrandIdentityPage';
import SocialMediaPage from './pages/ai/SocialMediaPage';
import ThumbnailPage from './pages/ai/ThumbnailPage';
import CopywriterPage from './pages/ai/CopywriterPage';
import PosterGeneratorPage from './pages/ai/PosterGeneratorPage';
import BannerCreatorPage from './pages/ai/BannerCreatorPage';
import AdCreativePage from './pages/ai/AdCreativePage';
import DesignAnalyzerPage from './pages/ai/DesignAnalyzerPage';
import BackgroundRemoverPage from './pages/ai/BackgroundRemoverPage';
import MockupGeneratorPage from './pages/ai/MockupGeneratorPage';
import SmartResizerPage from './pages/ai/SmartResizerPage';
import TrendAnalyzerPage from './pages/ai/TrendAnalyzerPage';

import ProjectsPage from './pages/projects/ProjectsPage';
import SettingsPage from './pages/settings/SettingsPage';
import TemplatesPage from './pages/templates/TemplatesPage';
import TeamPage from './pages/team/TeamPage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import PaymentHistoryPage from './pages/subscription/PaymentHistoryPage';
import ActivityLogPage from './pages/activity/ActivityLogPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ErrorBoundary from './components/common/ErrorBoundary';
import AIChatbot from './components/chat/AIChatbot';

// Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// App Content
function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ai/design-generator" element={<DesignGeneratorPage />} />
            <Route path="/ai/color-palette" element={<ColorPalettePage />} />
            <Route path="/ai/logo-generator" element={<LogoGeneratorPage />} />
            <Route path="/ai/brand-identity" element={<BrandIdentityPage />} />
            <Route path="/ai/social-media" element={<SocialMediaPage />} />
            <Route path="/ai/thumbnail" element={<ThumbnailPage />} />
            <Route path="/ai/copywriter" element={<CopywriterPage />} />
            
            {/* New AI routes */}
            <Route path="/ai/poster" element={<PosterGeneratorPage />} />
            <Route path="/ai/banner" element={<BannerCreatorPage />} />
            <Route path="/ai/ad-creative" element={<AdCreativePage />} />
            <Route path="/ai/analyzer" element={<DesignAnalyzerPage />} />
            <Route path="/ai/bg-remover" element={<BackgroundRemoverPage />} />
            <Route path="/ai/mockup" element={<MockupGeneratorPage />} />
            <Route path="/ai/resizer" element={<SmartResizerPage />} />
            <Route path="/ai/trends" element={<TrendAnalyzerPage />} />

            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/payments" element={<PaymentHistoryPage />} />
            <Route path="/activity" element={<ActivityLogPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {isAuthenticated && <AIChatbot />}
      </ErrorBoundary>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
