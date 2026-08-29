import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'

import AboutPage from './pages/company/AboutPage.jsx'
import FoodSafetyPage from './pages/company/FoodSafetyPage.jsx'
import GiftCardsPage from './pages/company/GiftCardsPage.jsx'
import HowItWorksPage from './pages/company/HowItWorksPage.jsx'
import PartnerPage from './pages/company/PartnerPage.jsx'
import PrivacyPage from './pages/company/PrivacyPage.jsx'
import RefundsPage from './pages/company/RefundsPage.jsx'
import SupportPage from './pages/company/SupportPage.jsx'
import SustainabilityPage from './pages/company/SustainabilityPage.jsx'
import TermsPage from './pages/company/TermsPage.jsx'

import DiscoverPage from './pages/customer/DiscoverPage.jsx'
import ProviderDetailPage from './pages/customer/ProviderDetailPage.jsx'
import CheckoutPage from './pages/customer/CheckoutPage.jsx'
import OrdersPage from './pages/customer/OrdersPage.jsx'
import OrderTrackingPage from './pages/customer/OrderTrackingPage.jsx'
import ProfilePage from './pages/customer/ProfilePage.jsx'

import DashboardPage from './pages/provider/DashboardPage.jsx'
import MenuManagementPage from './pages/provider/MenuManagementPage.jsx'
import ProviderOrdersPage from './pages/provider/OrdersPage.jsx'
import PlansSetupPage from './pages/provider/PlansSetupPage.jsx'
import HolidayCalendarPage from './pages/provider/HolidayCalendarPage.jsx'
import VerificationPage from './pages/provider/VerificationPage.jsx'
import ProviderReviewsPage from './pages/provider/ReviewsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Where Firebase's password-reset email lands, carrying its oobCode. */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Public content pages -- every footer link resolves to one of these. */}
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/food-safety" element={<FoodSafetyPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/sustainability" element={<SustainabilityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refunds" element={<RefundsPage />} />

        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/providers/:id" element={<ProviderDetailPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="customer">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id/track"
          element={
            <ProtectedRoute role="customer">
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="customer">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute role="provider">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/menu"
          element={
            <ProtectedRoute role="provider">
              <MenuManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/orders"
          element={
            <ProtectedRoute role="provider">
              <ProviderOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/plans"
          element={
            <ProtectedRoute role="provider">
              <PlansSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/holidays"
          element={
            <ProtectedRoute role="provider">
              <HolidayCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/verification"
          element={
            <ProtectedRoute role="provider">
              <VerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute role="provider">
              <ProviderReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LandingPage />} />
      </Route>
    </Routes>
  )
}
